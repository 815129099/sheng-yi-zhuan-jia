import { Injectable } from '@angular/core';
import { AjaxResult } from 'src/app/shared/classes/ajax-result';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Product } from './product';
import {UUID} from 'angular2-uuid';
import { PRODUCTS } from './mock.products';
import { PageResult } from 'src/app/shared/classes/page-result';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { ActiveCategory } from './category/active-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  categorySubject = new Subject<ActiveCategory>();
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

  async getList(index: number, size: number): Promise<AjaxResult> {
    if (index < 0) {
      throw new Error('分页索引应大于等于0');
    }

    if (size <= 0) {
      throw new Error('每页显示的记录数应大于0');
    }

    const products: Product[] = this.localStorageService.get('Product', PRODUCTS);
    const list = products.slice(index * size, (index + 1) * size);
    const data: PageResult = new PageResult(products.length, list);
    return new AjaxResult(true, data);
  }


  /**
   * 根据id查询
   * @param index 
   * @param size 
   * @param categoryId 
   */
  async getListByCategoryId(index: number, size: number, categoryId: number): Promise<AjaxResult> {
    if (index < 0) {
      throw new Error('分页索引小于0');
    }

    if (size <= 0) {
      throw new Error('每页显示的记录数小于0');
    }
    const products: Product[] = this.localStorageService.get('Product', PRODUCTS);
    const productList: Product[] = [];
    for (const p of products) {
      if (p.categoryId === categoryId) {
        productList.push(p);
      }
    }
    const res = productList.slice(index * size, (index + 1) * size);
    const data: PageResult = new PageResult(productList.length, res);
    return new AjaxResult(true, data);
  }

  /**
   * 根据查询条件查询
   * @param index 
   * @param size 
   * @param query 
   */
  getListByQuery(index: number, size: number, query: string): PageResult {
    const regex = new RegExp(query);
    const pList: Product[] = [];
    const products: Product[] = this.localStorageService.get('Product', PRODUCTS);
    products.forEach(product => {
      if (product.name.match(regex) || product.barcode.match(regex)) {
        pList.push(product);
      }
    });
    const list = pList.slice(index * size, (index + 1) * size);
    const data: PageResult = new PageResult(pList.length, list);
    return data;
  }

  setActiveCategory(activeCategory: ActiveCategory) {
    this.categorySubject.next(activeCategory);
  }

  watchCategory(): Observable<ActiveCategory> {
    return this.categorySubject.asObservable();
  }
}
