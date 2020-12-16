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
      console.log("执行守卫");
      let user = this.localStorageService.get("User", null);
      //当前有用户登录
      if (user != null) {
        let currentTime = new Date().getTime();
        //当前用户登陆过，且未过期
        let date = Date.parse(user.createTime);
        console.log("登录时间"+this.localStorageService.parseDate(new Date(date),"YYYY-mm-dd HH:MM:SS"));
        console.log("当前时间"+this.localStorageService.parseDate(new Date(),"YYYY-mm-dd HH:MM:SS"));
        if(date+ 1000*60*5>currentTime){
          //没有过期重置登录时间
          console.log("没有过期重置登录时间");
            user.createTime = new Date();
            this.localStorageService.set("User", user);
            this.router.navigateByUrl('home');
            return false;
        }else{
          //登录过期，user置空
          console.log("登录过期，user置空");
          this.localStorageService.set("User", null);
        }
      }

      //当前没有用户登录
      this.router.navigateByUrl('passport/login');
      return false;
    }
  }

}
