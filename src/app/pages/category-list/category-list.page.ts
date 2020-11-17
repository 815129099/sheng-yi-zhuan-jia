import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Category } from '../product/category/category';
import { CategoryService } from '../product/category/category.service';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.page.html',
    styleUrls: ['./category-list.page.scss'],
})
export class CategoryListPage implements OnInit {

    //
    categories: Category[];
    activeCategory: Category;
    subCategories: Category[];
    activeSubCategory: Category;
    tab = '';

    
    constructor(
        private categoryService: CategoryService,
        private actionSheetCtrl: ActionSheetController,
        private router: Router,
    ) {
        categoryService.getAll().then((data) => {
            this.categories = data.data;
            if (this.categories) {
                this.activeCategory = this.categories[0];
            }
        });
    }

    async onPresentActionSheet() {
        const actionSheet = await this.actionSheetCtrl.create({
            header: '选择操作',
            buttons: [
                {
                    text: '新增小分类',
                    role: 'destructive',
                    handler: () => {
                        console.log('Destructive clicked');
                        this.router.navigate(['/category-add'], {queryParams: {'categoryName': this.activeCategory.name}});
                    }
                }, {
                    text: '编辑分类',
                    handler: () => {
                        console.log('Archive clicked');
                        this.router.navigate(['/category-edit'], {queryParams: {'categoryId': this.activeCategory.id}});
                    }
                }, {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        await actionSheet.present();
    }

    getItemColor(id: number): string {
        if (id === this.activeCategory.id) {
            return '';
        } else {
            return 'light';
        }
    }

    onSelectCategory(category: Category) {
        this.activeCategory = category;
        this.subCategories = this.activeCategory.children;
    }

    /**
     *   选中小分类
     */
    onSelectSubCategory(category: Category) {
        if (this.tab === 'FromProductAdd') {
            // this.events.publish('category:selected', category, Date.now());
            // console.log('category:selected');
            // this.location.back();
        }
    }

    gotoAddCategory() {
    }

    ngOnInit() {
    }

}