import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonItemSliding, ModalController, ToastController } from '@ionic/angular';
import { Category } from '../category';
import { CategoryNameEditPage } from '../category-name-edit/category-name-edit.page';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.page.html',
  styleUrls: ['./category-edit.page.scss'],
})
export class CategoryEditPage implements OnInit {

  private categoryId: any;
  private category: Category;
  constructor(
    private modalController: ModalController,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.categoryId = queryParams.categoryId;
      this.category = this.categoryService.get(this.categoryId);
    });
  }

  ngOnInit() {
  }

  private async presentModal(name: string) {
    const modal = await this.modalController.create({
      component: CategoryNameEditPage,
      componentProps: { value: name }
    });
    await modal.present();
    return modal.onWillDismiss();
  }

  /**
   * 修改大分类名称
   * @param item 
   */
  async onEditCategoryName(item: IonItemSliding) {
    item.close();
    const { data } = await this.presentModal(this.category.name);
    if (data) {
      this.category.name = data;
    }
  }

  /**
   * 修改小分类名称
   * @param item 
   * @param subCategory 
   */
  async onEditSubCategoryName(item: IonItemSliding, subCategory: Category) {
    item.close();
    const { data } = await this.presentModal(subCategory.name);
    let flag = 0;
    for (const c of this.category.children) {
      if (data == '' || (data != subCategory.name && data === c.name)) {
        const toast = await this.toastCtrl.create({
          message: '小分类名称不可为空或不可重复',
          duration: 3000
        });
        toast.present();
        flag = 1;
        break;
      }
    }
    if (flag === 0) {
      subCategory.name = data;
    }
  }

  async onDelete(item: IonItemSliding, subId?: number) {
    let toast = await this.toastCtrl.create({
      duration: 3000
    });
    const alert = await this.alertController.create({
      header: '你确认要删除吗!',
      message: '请先删除该类别下的所有商品记录',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: '确认',
          handler: async () => {
            console.log('Confirm Okay');

            if (subId != null) {
              item.close();
              await this.categoryService.delete(this.category.id, subId).then((data) => {
                if (data.success == true) {
                  toast.message = "删除成功!";
                  toast.present();
                } else {
                  toast.message = data.error.message;
                  toast.present();
                }
              });
              this.category = this.categoryService.get(this.categoryId);
            } else if (this.category.children.length === 0) {
              item.close();
              await this.categoryService.delete(this.category.id).then((data) => {
                if (data.success == true) {
                  toast.message = "删除成功!";
                  toast.present();
                } else {
                  toast.message = data.error.message;
                  toast.present();
                }
              });
              this.router.navigateByUrl('/product/category/list');
            } else {
              item.close();
            }

          }
        }
      ]
    });

    await alert.present();
  }

  async onSave() {
    let toast = await this.toastCtrl.create({
      duration: 3000
    });
    await this.categoryService.modify(this.category).then((data) => {
      if (data.success == false) {
        toast.message = data.error.message;
        toast.present();
      } else {
        toast.message = "修改成功!";
        toast.present();
      }
    });

    this.router.navigateByUrl('/product/category/list');
  }

}