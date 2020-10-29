import { Component, OnInit,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonSlides } from '@ionic/angular';
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

  slideIndex = 0;
  constructor(private authenticationCodeService:AuthenticationCodeService) { }

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
  this.authenticationCodeService.createCode();
}

onValidateCode(code:string):boolean{
    return this.authenticationCodeService.validate(code);
}
}

