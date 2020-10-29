import { Component, OnInit,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonSlides } from '@ionic/angular';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AuthenticationCodeService } from '../authentication-code.service';
import {Signup} from './signup';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})


export class SignupPage implements OnInit {
  @ViewChild('signupSlides', {static: false}) signupSlides: IonSlides;
  signup: Signup = {
    phone: '',
    email: '',
    shopName: '',
    password: '',
    confirmPassword: '',
    code: ''
  };
  phoneSubmited=false;
  codeSubmited=false;
  //按钮切换
  showButtonText = "发送验证码";
  countDowmTime = 60;
  countDown= false;

  slideIndex = 0;
  constructor(private authenticationCodeService:AuthenticationCodeService,private localStorageService:LocalStorageService) { }

  ngOnInit() {
  //  this.signupSlides.lockSwipeToNext(true);
  }
  onNext(){
    this.signupSlides.slideNext();
  }
  onPrevious() {
    this.signupSlides.slidePrev()
  }


onSlideWillChange(event){
   this.signupSlides.getActiveIndex().then((index)=>{
     this.slideIndex = index;
   })
}

onSubmitPhone(form:NgForm){
  this.phoneSubmited = false;
  if (form.valid) {
    // 已通过客户端验证
    this.phoneSubmited = true;
    this.onNext();
    console.log("手机号验证成功");
  }
}

onSubmitCode(form:NgForm){
  this.codeSubmited = false;
  //验证码验证
  let result = this.onValidateCode(this.signup.code);
  console.log(result);
  if(result==true){
    this.onNext();
    this.codeSubmited = true;
    console.log("验证码验证成功");
  }
}

onSendSMS(){
  let codeTime = this.localStorageService.get(this.signup.phone, 0);
    if (codeTime == 3) {
      this.showButtonText = '已获取三次';
      this.countDown = true;
      return;
    } else {
      codeTime++;
      this.localStorageService.set(this.signup.phone, codeTime);
    }


  this.authenticationCodeService.createCode();
  this.countDown = true;                // 发送验证码后一分钟内，按钮变成不可点击状态 
  this.showButtonText = '验证码已发送（' +60+ 's）';           // 验证码发送后的初始状态 
  const start = setInterval(()=>{
     if(this.countDowmTime>=0){
       this.showButtonText = '验证码已发送('+this.countDowmTime--+'s)';
     }else{
       clearInterval(start);
       this.countDowmTime = 60;
       this.showButtonText = '重新发送';
       this.countDown = false;
     }
  },1000)
}

onValidateCode(code:string):boolean{
    return this.authenticationCodeService.validate(code);
}
}

