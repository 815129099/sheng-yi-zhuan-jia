import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocalStorageService } from './shared/services/local-storage.service';
import { ShopService } from './pages/setting/shop/shop.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    { title: '开店论坛', url: '/home', icon: 'chatbox' },
  { title: '手机橱窗', url: '/home', icon: 'create' },
  { title: '邀请有礼', url: '/home', icon: 'git-merge' },
  { title: '资金账户', url: '/home', icon: 'cash' },
  { title: '反馈建议', url: '/home', icon: 'cash' },
  { title: '帮助中心', url: '/home', icon: 'cash' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  public username;
  public phone;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private localStorageService:LocalStorageService,
    private shopService:ShopService
  ) {
    this.initializeApp();
    this.showShop();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //debugger;
    });
  }

  showShop() {
    let user = this.localStorageService.get("User",null);
    if(user!=null){
      let currentShop = this.shopService.getShop(user.id);
      this.username = currentShop.shopName;
      this.phone = user.phone;
    }
}
  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
}
