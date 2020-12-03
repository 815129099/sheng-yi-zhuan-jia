import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddProductPage } from './add-product/add-product.page';
import { CategoryAddPage } from './category/category-add/category-add.page';
import { CategoryEditPage } from './category/category-edit/category-edit.page';
import { CategoryListPage } from './category/category-list/category-list.page';
import { CategoryPage } from './category/category.page';
import { ProductListPage } from './product-list/product-list.page';

import { ProductPage } from './product.page';

const routes: Routes = [
  {
    path: '',
    component: ProductPage
  },
  {
    path: 'category',
    component:CategoryPage
  },
  {
    path: 'category/list',
    component: CategoryListPage
  }, 
  {
    path: 'category/add',
    component: CategoryAddPage
  },
  {
    path: 'category/edit',
    component: CategoryEditPage
  },
  {
    path: 'product/add',
    component:AddProductPage
  },
  {
    path: 'product/list',
    component:ProductListPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductPageRoutingModule {}
