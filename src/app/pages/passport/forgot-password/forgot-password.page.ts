import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController, IonSlides, MenuController, ToastController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AuthenticationCodeService } from '../authentication-code.service';
import { BasePage } from '../basepage';
import { PassportService } from '../passport.service';
import { Account } from './account';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage extends BasePage implements OnInit {
  @ViewChild('accountSlides', { static: true }) accountSlides: IonSlides;
  accounts: Account = {
    account: '',
    password: '',
    confirmPassword:'',
    code: ''
  };
    //按钮切换
    showButtonText = "发送验证码";
    countDowmTime = 60;
    countDown = false;
  //显示验证码错误
  slideIndex = 0;
  constructor(private authenticationCodeService: AuthenticationCodeService, private localStorageService: LocalStorageService, private toastController: ToastController,private passportService:PassportService,private alertController:AlertController,public menuController:MenuController) {
    super(menuController);
   }

  ngOnInit() {
    this.accountSlides.lockSwipeToNext(true);
  }
  onNext() {
    this.accountSlides.lockSwipeToNext(false);
    this.accountSlides.slideNext();
    this.accountSlides.lockSwipeToNext(true);
  }
  onPrevious() {
    this.accountSlides.lockSwipeToNext(false);
    this.accountSlides.slidePrev();
    this.accountSlides.lockSwipeToNext(true);
  }

  onSlideWillChange(event) {
    this.accountSlides.getActiveIndex().then((index) => {
      this.slideIndex = index;
    })
  }

  /**
   * 验证账户是否存在
   * @param form 
   */
  async onSubmitAccount(form: NgForm) {
    await this.passportService.isUniqueAccount(this.accounts.account).then((result) => {
      if (result.success) {
        this.onNext();
      } else {
        this.alertController.create({
          header: '警告',
          buttons: ['确定']
        }).then((alert) => {
          alert.message = result.error.message;
          alert.present();
        });
      }
    });
  }

  /**
   * 
   * @param form 表单
   */
  async onSubmitCode(form: NgForm) {
    let toast = await this.toastController.create({
      duration: 3000
    });
    //验证码验证
    let result = this.onValidateCode(this.accounts.code);
    console.log(result);
    if (result == true) {
      this.onNext();
      console.log("验证码验证成功");
    } else {
      toast.message = "验证码不一致!";
      toast.present();
    }
  }

   /**
   * 
   * @param code 验证码
   */
  onValidateCode(code: string): boolean {
    return this.authenticationCodeService.validate(code);
  }

  /**
   * 发送验证码
   */
  onSendSMS() {
    let codeTime = this.localStorageService.get(this.accounts.account, 0);
    if (codeTime == 3) {
      this.showButtonText = '已获取三次';
      this.countDown = true;
      return;
    } else {
      codeTime++;
      this.localStorageService.set(this.accounts.account, codeTime);
    }

    let code = this.authenticationCodeService.createCode();
    this.accounts.code = code;
    this.countDown = true;                // 发送验证码后一分钟内，按钮变成不可点击状态 
    this.showButtonText = '验证码已发送（' + 60 + 's）';           // 验证码发送后的初始状态 
    const start = setInterval(() => {
      if (this.countDowmTime >= 0) {
        this.showButtonText = '验证码已发送(' + this.countDowmTime-- + 's)';
      } else {
        clearInterval(start);
        this.countDowmTime = 60;
        this.showButtonText = '重新发送';
        this.countDown = false;
      }
    }, 1000)
  }

   /**
   * 
   * @param form 表单
   */
  async onSubmitUser(form: NgForm) {
    let toast = await this.toastController.create({
      duration: 3000
    });
    if (this.accounts.password !== this.accounts.confirmPassword) {
      toast.message = "密码不一致！";
      toast.present();
    } else {
      await this.passportService.updatePassword(this.accounts.account,this.accounts.password).then((result) => {
        if (result.success) {
          this.onNext();
        } else {
          this.alertController.create({
            header: '警告',
            buttons: ['确定']
          }).then((alert) => {
            alert.message = result.error.message;
            alert.present();
          });
        }
      });
    }
  }
}
