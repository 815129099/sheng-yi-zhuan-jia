
import { ShopService } from './../shop.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingService } from '../../setting.service';
import { ToastController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ShopPage } from '../shop.page';
import { StatusBar } from '@ionic-native/status-bar/ngx';
@Component({
  selector: 'app-shop-edit',
  templateUrl: './shop-edit.page.html',
  styleUrls: ['./shop-edit.page.scss'],
})
export class ShopEditPage implements OnInit {

  title: string;
  property: string;
  value: any; // 用于ngModel，从shop对象的相关属性中获取数据

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private shopService: ShopService,
    private toastCtrl: ToastController,
    private localStorageService :LocalStorageService,
    private statusBar:StatusBar
  ) {
     // 沉浸式并且悬浮透明
     this.statusBar.overlaysWebView(true);
    activatedRoute.queryParams.subscribe(queryParams => {
      this.property = queryParams.property;
      this.title = queryParams.title;
    });
  }

  ngOnInit() {
  }

  async onSave() {
    const user = this.localStorageService.getUser();
    const shop = this.shopService.getShop(user.id);
    shop[this.property] = this.value;
    this.shopService.updateShop(shop);

    this.value = '';
    const toast = await this.toastCtrl.create({
      message: '保存成功',
      duration: 3000
    });
    toast.present();
    this.router.navigateByUrl('/setting/shop');
  }

}
