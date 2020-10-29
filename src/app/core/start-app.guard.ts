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
        launched: false,
        version: '1.0.0'
      });
      if ( appConfig.launched === false ) {
        appConfig.launched = true;
        this.localStorageService.set(APP_KEY, appConfig);
        return true;
      } else {
        this.router.navigateByUrl('folder/Inbox');
        return false;
      }
  }
  
}
