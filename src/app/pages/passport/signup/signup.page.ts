import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IonSlides, MenuController } from '@ionic/angular';
import { AjaxResult } from 'src/app/shared/classes/ajax-result';
import { AlertController, ToastController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AuthenticationCodeService } from '../authentication-code.service';
import { BasePage } from '../basepage';
import { PassportService } from '../passport.service';
import { Signup } from './signup';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})


export class SignupPage extends BasePage implements OnInit {
  @ViewChild('signupSlides', { static: true }) signupSlides: IonSlides;
  signup: Signup = {
    phone: '',
    email: '',
    shopName: '',
    password: '',
    confirmPassword: '',
    code: ''
  };
  //按钮切换
  showButtonText = "发送验证码";
  countDowmTime = 60;
  countDown = false;

  //显示验证码错误
  slideIndex = 0;
  constructor(private authenticationCodeService: AuthenticationCodeService,private toastController: ToastController, private localStorageService: LocalStorageService, private passportService: PassportService,public menuController:MenuController,private router:Router,private appComponent:AppComponent) {
    super(menuController)
  }

  ngOnInit() {
    this.signupSlides.lockSwipeToNext(true);
  }
  onNext() {
    this.signupSlides.lockSwipeToNext(false);
    this.signupSlides.slideNext();
    this.signupSlides.lockSwipeToNext(true);
  }
  onPrevious() {
    this.signupSlides.lockSwipeToNext(false);
    this.signupSlides.slidePrev();
    this.signupSlides.lockSwipeToNext(true);
  }


  onSlideWillChange(event) {
    this.signupSlides.getActiveIndex().then((index) => {
      this.slideIndex = index;
    })
  }

  /**
   * 
   * @param form 表单
   */
  async onSubmitPhone(form: NgForm) {
    let toast = await this.toastController.create({
      duration: 3000
    });
    if (form.valid) {
      // 已通过客户端验证
      this.onNext();
      toast.message = "手机号验证成功";
      toast.present();
    }
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
    let result = this.onValidateCode(this.signup.code);
    console.log(result);
    if (result == true) {
      this.onNext();
      toast.message = "验证码验证成功";
      toast.present();
    } else {
      toast.message = "验证码不一致或者已过期";
      toast.present();
    }
  }

  /**
   * 
   * @param form 表单
   */
  async onSubmitUser(form: NgForm) {
    let toast = await this.toastController.create({
      duration: 3000
    });
    if (this.signup.password !== this.signup.confirmPassword) {
      toast.message = "密码不一致！";
      toast.present();
    } else {
      this.onRegister();
    }
  }

  async onSendSMS() {
    let codeTime = this.localStorageService.get(this.signup.phone, 0);
    if (codeTime == 3) {
      this.showButtonText = '已获取三次';
      this.countDown = true;
      return;
    } else {
      codeTime++;
      this.localStorageService.set(this.signup.phone, codeTime);
    }

    let code = this.authenticationCodeService.createCode();
    this.signup.code = code;
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
   * @param code 验证码
   */
  onValidateCode(code: string): boolean {
    return this.authenticationCodeService.validate(code);
  }

  async onRegister() {
    let toast = await this.toastController.create({
      duration: 3000
    });
    let ajaxResult = await this.passportService.addUser(this.signup);
    if (ajaxResult.success) {
      this.onNext();
      toast.message = "注册成功！";
      toast.present();
    } else {
      toast.message = ajaxResult.error.message;
      toast.present();
    }
  }

  async onLogin(){
    this.passportService.login(this.signup.phone, this.signup.password).then((result) => {
      if (result.success) {
        this.router.navigateByUrl('home');
        this.appComponent.showShop();
        // 验证成功，自行完成页面跳转
      } else {
        this.router.navigateByUrl('passport/login');
      }
    });
  }

}

