import { Shop } from './shop';
import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { Injectable } from '@angular/core';

export const T_SHOP = 'TShop';
@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(private localStorageService: LocalStorageService) { }

  getShop(userId: number): Shop {
    const shops = this.localStorageService.get("Tshop", []);
    if (shops.length <= 0) {
      return null;
    }
    for (const s of shops) {
      if (s.userId === userId) {
        return s;
      }
    }
    return null;
  }

  //用户注册时addUser时调用
  addShop(shop: Shop) {
    const shops = this.localStorageService.get("Tshop", []);
    shops.push(shop);
    this.localStorageService.set("Tshop", shops);
  }

  updateShop(shop: Shop): boolean {
    const shops = this.localStorageService.get("Tshop", []);
    for(let i=0;i<shops.length;i++){
      if(shops[i].userId===shop.userId){
        shops[i] = shop;
        this.localStorageService.set("Tshop", shops);
        return true;
      }
    }

    return false;
  }
}