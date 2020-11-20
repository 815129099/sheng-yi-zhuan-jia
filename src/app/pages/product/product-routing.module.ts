import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryAddPage } from './category/category-add/category-add.page';
import { CategoryEditPage } from './category/category-edit/category-edit.page';
import { CategoryListPage } from './category/category-list/category-list.page';

import { ProductPage } from './product.page';

const routes: Routes = [
  {
    path: '',
    component: ProductPage
  },
  {
    path: 'category',
    loadChildren: () => import('./category/category.module').then( m => m.CategoryPageModule)
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductPageRoutingModule {}
