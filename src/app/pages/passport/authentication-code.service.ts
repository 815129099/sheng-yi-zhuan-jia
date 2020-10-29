import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationCodeService {
  // 用于保存验证码
  private code: string;
  // 存放验证码的过期时间
  private deadline: number;
  constructor() {
    this.code = '';
  }
  // 生成指定长度的随机数字
  createCode(count:number = 4, timeout: number = 10): string{
    this.code = '';
    // 10分钟内有效
    this.deadline = Date.now() + 60 * timeout * 1000;
     //设置随机字符
     var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
     //循环count 我设置的4就是循环4次
    for (let i = 0; i < count; i++) {
      //设置随机数范围,这设置为0 ~ 36
      var index = Math.floor(Math.random() * 9);
       //字符串拼接 将每次随机的字符 进行拼接
      this.code+= random[index];
    }
    console.log(this.code);
    return this.code;
  }
  // 验证用户输入的短信验证码是否一致，是否过期
  validate(value: string): boolean{
    const now = Date.now();
    return value === this.code && now < this.deadline;
  }
}