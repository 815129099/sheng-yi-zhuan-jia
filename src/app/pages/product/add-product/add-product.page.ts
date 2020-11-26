import { Product } from './../product';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CategoryService } from '../category/category.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit, OnDestroy {

  product: Product;
  subscription: Subscription;
  text: string;
  constructor(
    private productService: ProductService,
    private router: Router,
    private alertCtrl: AlertController,
    private categoryService: CategoryService,
    private zone: NgZone,
    private barcodeScanner: BarcodeScanner,
    private camera: Camera,
    private imagePicker: ImagePicker,
    private actionSheetCtrl: ActionSheetController,
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

  cameraOptions: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };

  private imagePickerOptions = {
    quality: 100,
    destinationType: 0,
    enodingType: 0,
    mediaType: 0,
    sourceType: 0
  };

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

  onScan() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.product.barcode = barcodeData.text;
    }).catch(err => {
      console.log('Error', err);
    });
  }

  async onChoose() {
    const actionSheet = await this.actionSheetCtrl.create({
        header: '请选择操作',
        buttons: [
            {
                text: '相机',
                role: 'destructive',
                handler: () => {
                    this.onCamera();
                }
            }, {
                text: '相册',
                handler: () => {
                    this.onImagePicker();
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

  private onCamera() {
    this.camera.getPicture(this.cameraOptions).then((imageData) => {
      this.text = imageData;
      const base64Image = 'data:image/jpeg;base64,' + imageData;
      this.product.images.push(base64Image);
    }, (err) => {
      console.log('ERROR:' + err);
    });
  }

  private onImagePicker() {
    this.camera.getPicture(this.imagePickerOptions).then((imageData) => {
      const base64Image = 'data:image/jpeg;base64,' + imageData;
      this.product.images.push(base64Image);
    }, (err) => {
      console.log('ERROR:' + err);
    });
  }

}