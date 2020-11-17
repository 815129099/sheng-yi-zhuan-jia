import { Injectable } from '@angular/core';
import { AjaxResult } from 'src/app/shared/classes/ajax-result';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Shop } from '../setting/shop/shop';
import { ShopService } from '../setting/shop/shop.service';
import { Signup } from './signup/signup';

@Injectable({
  providedIn: 'root'
})
export class PassportService {

  constructor(private localStorageService: LocalStorageService, private shopService: ShopService) { }

  /**
    * 登录
    * @param phoneOrEmail 
    * @param password 
    */
  async login(phoneOrEmail: string, password: string): Promise<AjaxResult> {
    let accounts = this.localStorageService.get("TLoginAccount", []);
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].Identifier == phoneOrEmail && accounts[i].credential === password) {
        this.setLoginLog(accounts[i].userId, accounts[i].Identifier);
        this.setUser(accounts[i].userId);
        return new AjaxResult(true, null);
      }
    }
    return new AjaxResult(false, null, {
      message: '账户不存在或者密码错误',
      details: ''
    });
  }

  /**
   * 登录日志
   * @param userId 
   */
  public setLoginLog(userId: any, username: string) {
    let LoginLogs = this.localStorageService.get("LoginLogs", []);
    const loginLog: LoginLog = {
      userId: userId,
      username: username,
      loginTime: new Date().getTime(),
      expirTime: new Date().getTime() + 1000 * 60 * 60 * 24 * 5
    };
    LoginLogs.push(loginLog);
    this.localStorageService.set("LoginLogs", LoginLogs);
  }

  /**
   * 设置当前登录用户
   * @param userId 
   */
  public setUser(userId: any) {
    let users = this.localStorageService.get("TUser", []);
    for (let i = 0; i < users.length; i++) {
      if (users[i].id == userId) {
        let user = users[i];
        this.localStorageService.set("User", user);
      }
    }
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
    let userId = Date.now();
    const user: User = {
      id: userId,
      phone: sign.phone,
      email: sign.email,
      password: sign.password,
      createTime: new Date()
    };
    users = this.localStorageService.get("TUser", []);
    users.push(user);
    this.localStorageService.set("TUser", users);


    //添加手机号的账户
    const account: LoginAccount = {
      userId: userId,
      Identifier: sign.phone,
      credential: sign.password,
    }
    this.addAccount(account);
    //添加邮箱的账户
    const account1: LoginAccount = {
      userId: userId,
      Identifier: sign.email,
      credential: sign.password,
    }
    this.addAccount(account1);
    //添加店铺
    let shop: Shop = {
      userId: userId,
      shopName: '未填写',
      shopShortName: '未填写',
      userName: '未填写',
      shopTel: sign.phone,
      industryType: '未填写'
    }
    this.shopService.addShop(shop);
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
  async isUniqueAccount(account: string): Promise<AjaxResult> {
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

  async updatePassword(username: string, password: string) {
    let accounts = this.localStorageService.get("TLoginAccount", []);
    for (let i = 0; i < accounts.length; i++) {
      //根据手机号或者邮箱找到账户
      if (accounts[i].Identifier == username) {
        let userId = accounts[i].userId;
        //同一个用户以手机号和以邮箱为账户名的两个账户的id一致
        //再根据账户的id，修改另一个以邮箱或手机号为账户名的账户的密码
        for (let j = 0; j < accounts.length; j++) {
          if (accounts[j].userId === userId) {
            accounts[j].credential = password;
          }
        }
        this.localStorageService.set("TLoginAccount", accounts);
        return new AjaxResult(true, null);
      }
    }
    return new AjaxResult(false, null, {
      message: '账户不存在或者密码错误',
      details: ''
    });
  }

  public addAccount(account: LoginAccount) {
    let accounts = this.localStorageService.get("TLoginAccount", []);
    accounts.push(account);
    this.localStorageService.set("TLoginAccount", accounts);
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

export interface LoginLog {
  userId: string,
  username: string,
  loginTime: number,
  expirTime: number
}

