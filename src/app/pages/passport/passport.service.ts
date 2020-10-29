import { Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Signup } from './signup/signup';

@Injectable({
  providedIn: 'root'
})
export class PassportService {

  constructor(private localStorageService:LocalStorageService) { }

  public addUser(sign:Signup):boolean{
    //验证手机号是否唯一
    let users:User[];
    const user = {
      id:Date.now(),
      phone:sign.phone,
      email:sign.email,
      createTime:new Date()
    };
    users =  this.localStorageService.get("TUser",[]);
    users.push(user);
    this.localStorageService.set("TUser",users);
    let accounts : LoginAccount[];
    accounts = this.localStorageService.get("TLoginAccount",[]);
    const account = {
      userId:1,
      Identifier:"1",
      credential:"1"
    }
    accounts.push(account);
    this.localStorageService.set("TLoginAccount",accounts);
    return true;
  }

  public isUniquePhone(sign:Signup):boolean{
    let users =  this.localStorageService.get("TUser",[]);
    for(let i=0;i<users.length;i++){
      if(users[i].phone==sign.phone){
        return false;
      }
    }
    return true;
  }
}


export interface User{
  id:number;
  phone:string;
  email:string;
  createTime:Date
}

export interface LoginAccount{
  userId:number;
  Identifier:string;
  credential:string;
}