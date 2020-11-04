import { Injectable } from '@angular/core';
import { AjaxResult } from 'src/app/shared/classes/ajax-result';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Signup } from './signup/signup';

@Injectable({
  providedIn: 'root'
})
export class PassportService {

  constructor(private localStorageService: LocalStorageService) { }

  /**
    * 登录
    * @param phoneOrEmail 
    * @param password 
    */
  async login(phoneOrEmail: string, password: string): Promise<AjaxResult> {
    let accounts = this.localStorageService.get("TLoginAccount", []);
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].Identifier == phoneOrEmail && accounts[i].credential === password) {
        return new AjaxResult(true, null);
      }
    }
    return new AjaxResult(false, null, {
      message: '账户不存在或者密码错误',
      details: ''
    });
  }

  /**
   * 注册
   * @param sign 
   */
  async addUser(sign: Signup) {
    //验证手机号是否唯一
    let ajaxResult = this.isUniquePhone(sign.phone);
    if (!ajaxResult.success) {
      return ajaxResult;
    }

    //判断邮箱是否已存在
    let ajaxResult1 = this.isUniqueEmail(sign.email);
    if (!ajaxResult1.success) {
      return ajaxResult1;
    };
      //添加用户
    let users: User[];
    const user = {
      id: Date.now(),
      phone: sign.phone,
      email: sign.email,
      password: sign.password,
      createTime: new Date()
    };
    users = this.localStorageService.get("TUser", []);
    users.push(user);
    this.localStorageService.set("TUser", users);
    //添加账户
    let accounts: LoginAccount[];
    accounts = this.localStorageService.get("TLoginAccount", []);
    //添加手机号的账户
    const account = {
      userId: Date.now(),
      Identifier: sign.phone,
      credential: sign.password,
    }
    accounts.push(account);
    //添加邮箱的账户
    const account1 = {
      userId: Date.now(),
      Identifier: sign.email,
      credential: sign.password,
    }
    accounts.push(account1);
    this.localStorageService.set("TLoginAccount", accounts);
    return new AjaxResult(true, null);
  }

  /**
   * 判断手机号是否存在
   * @param sign 注册用户信息
   */
  public isUniquePhone(phone: string) {
    let users = this.localStorageService.get("TUser", []);
    for (let i = 0; i < users.length; i++) {
      if (users[i].phone === phone) {
        return new AjaxResult(false, null, {
          message: '您的手机号码已经被注册',
          details: ''
        });
      }
    }
    return new AjaxResult(true, null);
  }

  /**
   * 判断邮箱是否存在
   * @param sign 注册用户信息
   */
  public isUniqueEmail(email: string) {
    let users = this.localStorageService.get("TUser", []);
    for (let i = 0; i < users.length; i++) {
      if (users[i].email === email) {
        return new AjaxResult(false, null, {
          message: '您的邮箱已经被注册',
          details: ''
        });
      }
    }
    return new AjaxResult(true, null);
  }

  /**
   * 判断账户是否已存在
   * @param account 
   */
  async isUniqueAccount(account:string): Promise<AjaxResult>{
    let accounts = this.localStorageService.get("TLoginAccount", []);
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].Identifier == account) {
        return new AjaxResult(true, null);
      }
    }
    return new AjaxResult(false, null, {
      message: '账户不存在，请先注册',
      details: ''
    });
  }

  async updatePassword(username:string,password:string){
    let accounts = this.localStorageService.get("TLoginAccount", []);
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].Identifier == username) {
        accounts[i].credential = password;
        this.localStorageService.set("TLoginAccount", accounts);
        return new AjaxResult(true, null);
      }
    }
    return new AjaxResult(false, null, {
      message: '账户不存在或者密码错误',
      details: ''
    });
  }

}




export interface User {
  id: number;
  phone: string;
  email: string;
  password: string;
  createTime: Date
}

export interface LoginAccount {
  userId: number;
  Identifier: string;
  credential: string;
}

