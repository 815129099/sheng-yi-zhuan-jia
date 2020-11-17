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
      Launched: false,
      version: '1.0.0'
    });
    if (appConfig.Launched === false) {
      appConfig.Launched = true;
      this.localStorageService.set(APP_KEY, appConfig);
      return true;
    } else {
      let user = this.localStorageService.get("User", null);
      //当前有用户登录
      if (user != null) {
        let loginLogs = this.localStorageService.get("LoginLogs", []);
        let currentTime = new Date().getTime();
        for (let i = 0; i < loginLogs.length; i++) {
          //当前用户登陆过，且未过期
          if (user.userId == loginLogs[i].userId && currentTime < loginLogs[i].expirTime) {
            //重置过期时间
            loginLogs[i].expirTime = new Date().getTime() + 1000 * 60 * 60 * 24 * 5;
            this.localStorageService.set("LoginLogs", loginLogs);
            this.router.navigateByUrl('home');
            return false;
          }
        }
      }

      //当前没有用户登录 或者日志已删除
      this.router.navigateByUrl('passport/login');
      return false;
    }
  }

}
