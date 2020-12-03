import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductPageRoutingModule } from './product-routing.module';
import { ProductPage } from './product.page';
import { AddProductPage } from './add-product/add-product.page';
import { ProductListPage } from './product-list/product-list.page';
import { CategoryPage } from './category/category.page';
import { CategoryListPage } from './category/category-list/category-list.page';
import { CategoryNameEditPage } from './category/category-name-edit/category-name-edit.page';
import { CategoryAddPage } from './category/category-add/category-add.page';
import { CategoryEditPage } from './category/category-edit/category-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductPageRoutingModule
  ],
  declarations: [ProductPage,AddProductPage,ProductListPage,CategoryPage,CategoryListPage,CategoryNameEditPage,CategoryAddPage,CategoryEditPage]
})
export class ProductPageModule {}
