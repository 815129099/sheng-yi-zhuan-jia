import { ShopService } from './shop.service';
import { SettingService } from './../setting.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Shop } from './shop';
import { User } from '../../passport/passport.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {
  user:User;
  shop: Shop;
  constructor(private settingService: SettingService, private router: Router, private shopService: ShopService, private localStorageService: LocalStorageService
  ) {

  }

  ngOnInit() {
    this.ionViewWillEnter();
  }

  /**
   * 初始化店铺数据
   */
  ionViewWillEnter() {
    this.user = this.localStorageService.getUser();
    this.shop = this.shopService.getShop(this.user.id);
  }

 
}