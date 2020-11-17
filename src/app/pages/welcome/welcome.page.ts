import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
export const APP_KEY: string = 'App';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WelcomePage implements OnInit {
  showSkip = true;
  constructor(private localStorageService:LocalStorageService,private router:Router) { }

  ngOnInit() {
     // 第一次调用get方法时，'App'这个key不存在，第二个参数会作为默认值返回
  let appConfig: any = this.localStorageService.get('APP_KEY', {
    Launched: false,
    version: '1.0.0'
  });
  if ( appConfig.Launched === false ) {
    appConfig.Launched = true;
    this.localStorageService.set('APP_KEY', appConfig);
  } else {
    this.router.navigateByUrl('home');
  }
  }
  onSlideWillChange(event) {
    event.target.isEnd().then((end) => {
      this.showSkip = !end;
    });
  }

  onSkip(){
    
  }
}
