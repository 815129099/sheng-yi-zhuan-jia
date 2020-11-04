import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { PassportService } from '../passport.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private toastController: ToastController,private passportService:PassportService,private alertController:AlertController) { }

  ngOnInit() {
  }

  username: string = ''; // 视图模型的属性账号，双向绑定
  password: string = ''; // 视图模型的属性密码，双向绑定
  // ...其他省略

  // 点击登录按钮时调用
  async onLogin(form: NgForm) {
    let toast: any;
    // 判断表单验证是否正确
    if (form.invalid) {
      toast = await this.toastController.create({
        duration: 3000
      });
    }
    // 判断的代码省略，参考之前的任务自行补上下面代码
    if (form.controls.username.errors?.required) {
      toast.message = '请输入您的手机号码或者邮箱';
      toast.present();
      return;
    }
    if (form.controls.password.errors?.required) {
      toast.message = '请输入您的密码';
      toast.present();
      return;
    }
    this.passportService.login(this.username, this.password).then((result) => {
      if (result.success) {
        alert("登陆成功");
        // 验证成功，自行完成页面跳转
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
  // 点击忘记密码时调用
  onForgotPassword() {
    // 进入找回密码页面
  }

}
