import { Product } from './../product';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CategoryService } from '../category/category.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit, OnDestroy {

  product: Product;
  subscription: Subscription;

  constructor(
    private productService: ProductService,
    private router: Router,
    private alertCtrl: AlertController,
    private categoryService: CategoryService,
    private zone: NgZone,
  ) {
    this.initProduct();
    this.subscription = categoryService.watchCategory().subscribe(
      (activeCategory) => {
        this.product.categoryName = activeCategory.name;
        this.product.category = activeCategory;
        this.product.categoryId = activeCategory.id;
      },
      (error) => {
      }
    );
  }

  ngOnInit() {
  }

  private initProduct(): void {
    this.product = {
      id: '',
      name: '',
      categoryId: null,
      categoryName: '',
      category: null,
      barcode: '',
      images: [],
      price: null,
      purchasePrice: null,
      repertory: null,
      specification: '',
      remark: ''
    };
  }

  async onSave(flag: boolean = false) {
    this.productService.insert(this.product).then(async (data) => {
      if (data.success) {
        const alert = await this.alertCtrl.create({
          header: '提示',
          message: '添加成功',
          buttons: ['确定']
        });
        alert.present();
        if (flag) {
          this.initProduct();
          this.product.categoryName = '';
        } else {
          this.router.navigateByUrl('/home');
        }
      } else {
        const alert = await this.alertCtrl.create({
          header: '提示',
          message: '添加失败',
          buttons: ['确定']
        });
        alert.present();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSelect() {
    this.router.navigate(['/product/category/list'], {
      queryParams: {
        tab: 'FromProductAdd'
      }
    });
  }

}