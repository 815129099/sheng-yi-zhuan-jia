import { Injectable } from '@angular/core';
import { AjaxResult } from 'src/app/shared/classes/ajax-result';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Product } from './product';
import {UUID} from 'angular2-uuid';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private localStorageService:LocalStorageService) { }

  /**
   * 插入商品
   * @param product 
   */
  async insert(product: Product): Promise<AjaxResult> {
    const products = this.localStorageService.get("Product", []);
    product.id  = UUID.UUID();
    products.push(product);
    this.localStorageService.set("Product", products);
    return new AjaxResult(true,null);
  }
}
