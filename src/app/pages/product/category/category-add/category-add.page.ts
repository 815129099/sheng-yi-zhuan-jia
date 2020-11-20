import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Category } from '../category';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.page.html',
  styleUrls: ['./category-add.page.scss'],
})
export class CategoryAddPage implements OnInit {
  category: Category = {
    id: 0,
    name: '',
    children: []
  };
  categoryName: '';
  title: string;
  bigCategoryId: number;
  smallCategoryId: number;

  constructor(private activatedRoute: ActivatedRoute, private categoryService: CategoryService, private toastController: ToastController, private router: Router) {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.category.name = queryParams.categoryName;
      this.category.id = queryParams.id;
      this.category.children = [];
      if (this.category.id == 0) {
        this.addBigCategory();
      } else {
        this.addSmallCategory();
      }
    });
  }

  ngOnInit() {
  }

  onAddSubCategory() {
    this.category.children.push({
      id: this.bigCategoryId * 10 + this.smallCategoryId++,
      name: '',
      children: []
    });
  }

  /**
   * 大分类初始化
   */
  addBigCategory() {
    this.title = "添加大分类";
    this.smallCategoryId = 0;
    let num = this.categoryService.getBigCategoryNum() + 1;
    this.bigCategoryId = num;
    this.category = {
      id: 0,
      name: '',
      children: [{
        id: this.bigCategoryId * 10 + this.smallCategoryId++,
        name: '',
        children: []
      }]
    }
  }

  /**
   * 小分类初始化
   */
  addSmallCategory() {
    this.title = "添加小分类";
    let oldCategory = this.categoryService.getBigCategoryByName(this.category.name);
    this.smallCategoryId = oldCategory.children.length + 1;
    this.bigCategoryId = oldCategory.id;
    this.category = {
      id: 1,
      name: oldCategory.name,
      children: [{
        id: this.bigCategoryId * 10 + this.smallCategoryId++,
        name: '',
        children: []
      }]
    }
  }

  async onSave() {
    let toast = await this.toastController.create({
      duration: 3000
    });
    if (this.category.id == 0) {
      //处理大分类
      this.category.name = this.categoryName;
      let num = this.categoryService.getBigCategoryNum() + 1;
      this.category.id = num;
      this.categoryService.insert(this.category).then((data) => {
        if (data.success == true) {
          toast.message = '添加成功！';
          toast.present();
        } else {
          toast.message = data.error.message;
          toast.present();
        }
        this.router.navigateByUrl('product/category/list');
      });
    } else {
      //处理小分类
      let newCate = this.categoryService.getBigCategoryByName(this.category.name);
      let categorys = this.category.children;
      this.categoryService.insertSubCategory(categorys,newCate).then((data)=>{
        if(data.success==false){
          toast.message = data.error.message;
          toast.present();
        }else{
          toast.message = '添加成功！';
            toast.present();
            this.router.navigateByUrl('product/category/list');
        }
      });
    }
  }
}
