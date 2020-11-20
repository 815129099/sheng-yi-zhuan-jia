import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryAddPage } from './category-add/category-add.page';
import { CategoryEditPage } from './category-edit/category-edit.page';
import { CategoryNameEditPage } from './category-name-edit/category-name-edit.page';

import { CategoryPage } from './category.page';

const routes: Routes = [
  {
    path: '',
    component: CategoryPage
  },
  {
    path: 'category-add',
    component:CategoryAddPage
  },
  {
    path: 'category-edit',
    component:CategoryEditPage
  },
  {
    path: 'category-name-edit',
    component:CategoryNameEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryPageRoutingModule {}
