import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CategoryPageRoutingModule } from './category-routing.module';
import { CategoryPage } from './category.page';
import { CategoryNameEditPage } from './category-name-edit/category-name-edit.page';
import { CategoryListPage } from './category-list/category-list.page';
import { CategoryAddPage } from './category-add/category-add.page';
import { CategoryEditPage } from './category-edit/category-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryPageRoutingModule
  ],
  declarations: [CategoryPage,CategoryNameEditPage,CategoryListPage,CategoryAddPage,CategoryEditPage]
})
export class CategoryPageModule {}
