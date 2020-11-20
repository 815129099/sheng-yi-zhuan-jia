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
        if(date+ 1000 * 60 * 60 * 24 * 5>currentTime){
          //重置登录时间
            user.createTime = new Date();
            this.localStorageService.set("User", user);
            this.router.navigateByUrl('home');
            return false;
        }
      }

      //当前没有用户登录 或者日志已删除
      this.router.navigateByUrl('passport/login');
      return false;
    }
  }

}
