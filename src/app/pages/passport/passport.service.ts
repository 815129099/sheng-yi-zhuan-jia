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
        this.setLoginLog(accounts[i].userId,accounts[i].Identifier);
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
  public setLoginLog(userId:any,username:string){
    let loginLogs = this.localStorageService.get("loginLogs", []);
    const loginLog:LoginLog = {
      userId:userId,
      username:username,
      loginTime: new Date().getTime(),
      expirTime:new Date().getTime()+1000*60*60*24*5
    };
    loginLogs.push(loginLog);
    this.localStorageService.set("loginLogs", loginLogs);
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
    const user = {
      id: userId,
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
    let id = accounts==undefined || accounts.length<=0?0:accounts.length;
    id++;
    accounts = this.localStorageService.get("TLoginAccount", []);
    //添加手机号的账户
    const account = {
      id:id,
      userId: userId,
      Identifier: sign.phone,
      credential: sign.password,
    }
    accounts.push(account);
    //添加邮箱的账户
    id++;
    const account1 = {
      id:id,
      userId: userId,
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
      //根据手机号或者邮箱找到账户
      if (accounts[i].Identifier == username) {
        let id = accounts[i].userId;
        //同一个用户以手机号和以邮箱为账户名的两个账户的id一致
        //再根据账户的id，修改另一个以邮箱或手机号为账户名的账户的密码
        for (let j = 0; j < accounts.length; j++) {
            if(accounts[j].userId===id){
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
  username:string,
  loginTime:number,
  expirTime:number
}

