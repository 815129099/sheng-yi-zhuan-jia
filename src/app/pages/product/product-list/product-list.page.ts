import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AjaxResult } from 'src/app/shared/classes/ajax-result';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { timer, Subscription } from 'rxjs';
import { PageResult } from 'src/app/shared/classes/page-result';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
  //当前页码，显示哪一页的商品数据
  currentIndex  = 0;
  //存放商品数据
  products :any[] = [];
  //商品总记录数
  total = -1;
  //查询条件
  queryTerm  = '';
  //类别编号，用于保存用户选择的类别，初始值为-1
  categoryId = -1;
  subscription: Subscription;
  totalNum: number;
  totalRepertory: number;
  constructor(private loadingController:LoadingController,
    private productService:ProductService,
    private router:Router,
    private toastController:ToastController) { 
      this.subscription = productService.watchCategory().subscribe(
        (activeCategory) => {
          this.categoryId = activeCategory.id;
          this.load(() => { }, 1);
        },
        (error) => {
          console.log(error);
        }
      );
    }

  async ngOnInit() {
    this.currentIndex = 0;
    this.categoryId = 0;

    const loading = await this.loadingController.create({
      message: '正在加载数据，请稍候...',
      spinner: 'bubbles',
    });
    loading.present();
    this.load(() => {
      loading.dismiss();
    }, 1);

  }

  async onReset() {
    this.currentIndex = 0;
    this.categoryId = 0;

    const loading = await this.loadingController.create({
      message: '正在加载数据，请稍候...',
      spinner: 'bubbles',
    });
    loading.present();
    this.load(() => {
      loading.dismiss();
    }, 1);

  }

  /**
   * @param completeFunc
   * @param reflash 1:刷新 0:concat
   */
  private async load(completeFunc: () => void, reflash: number) {
    try {
      let result: AjaxResult;
      if (this.categoryId === 0) {
        result = await this.productService.getList(this.currentIndex, 8);
      } else {
        result = await this.productService.getListByCategoryId(this.currentIndex, 8, this.categoryId);
      }
      const timerSubscription: Subscription = timer(500).subscribe(() => {
        completeFunc();
        this.total = result.data.total;
        this.products = reflash === 1 ? result.data.list : this.products.concat(result.data.list);
        this.getTotalCostAndTotalInventory(this.products);
      });
    } catch (error) {
      console.log(error);
    }
  }

  private getTotalCostAndTotalInventory(products: Product[]) {
    let totalNum = 0;
    let repertory = 0;
    for (const product of products) {
      repertory += product.repertory;
      totalNum += product.purchasePrice * product.repertory;
    }
    this.totalNum = totalNum;
    this.totalRepertory = repertory;
  }

  async onRefresh(event: any) {
    this.load(() => {
      event.target.complete();
    }, 1);
  }

  async onInfinite(event: any) {
    this.currentIndex++;
    if (this.currentIndex >= Math.ceil(this.total / 8)) {
      const toast = await this.toastController.create({
        duration: 3000,
        message: '没有数据了'
      });
      toast.present();
      this.currentIndex--;
      event.target.complete();
    } else {
      this.load(() => {
        event.target.complete();
      }, 0);
    }
  }

  onInput() {
    const data: PageResult = this.productService.getListByQuery(this.currentIndex, 8, this.queryTerm);
    this.total = data.total;
    this.products = data.list;
    this.getTotalCostAndTotalInventory(this.products);
    const timerSubscription: Subscription = timer(500).subscribe(() => {

    });

  }

  selectCategory() {
    this.router.navigate(['/product/category/list'], {
      queryParams: {
        tab: 'selectCategory'
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  gotoPage(str: string) {
    this.router.navigateByUrl(str);
  }

}
