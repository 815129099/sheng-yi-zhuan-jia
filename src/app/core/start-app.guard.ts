import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { APP_KEY } from '../pages/welcome/welcome.page';
import { LocalStorageService } from '../shared/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class StartAppGuard implements CanActivate {
  constructor(private localStorageService: LocalStorageService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const appConfig: any = this.localStorageService.get(APP_KEY, {
        isLaunched: false,
        version: '1.0.0'
      });
      if ( appConfig.isLaunched === false ) {
        appConfig.isLaunched = true;
        this.localStorageService.set(APP_KEY, appConfig);
        return true;
      } else {
        let loginLogs = this.localStorageService.get("loginLogs", []);
        let log = loginLogs==undefined||loginLogs.length<=0?null:loginLogs[loginLogs.length-1];
        let expirTime = log==null?0:log.expirTime;
        let currentTime = new Date().getTime();
        //未过期
        if(currentTime<expirTime){
          log.expirTime = new Date().getTime()+1000*60*60*24*5;
          loginLogs.push(log);
          this.localStorageService.set("loginLogs", loginLogs);
          this.router.navigateByUrl('home');
          return false;
        }
        //过期
        this.router.navigateByUrl('passport/login');
        return false;
      }
  }
  
}
