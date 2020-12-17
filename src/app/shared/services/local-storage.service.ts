import { Injectable } from '@angular/core';
import { User } from 'src/app/pages/passport/passport.service';
import { Shop } from 'src/app/pages/setting/shop/shop';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private storage: any = window.localStorage;
  constructor() { }

  get(key: string, defaultValue: any): any {
    if(key===null||key===""){
      return defaultValue;
    }
    let value: any = this.storage.getItem(key);
    try{
      value = JSON.parse(value);
    } catch (error) {
      value = null;
    }
    if (value === null && defaultValue) {
      value = defaultValue;
    }
    return value;
  }

  set(key: string, value: any):void {
    if(key===null||key===""){
      return;
    }
    this.storage.setItem(key,JSON.stringify(value));
  }

  remove(key: string):void {
    if(key===null||key===""){
      return;
    }
    this.storage.removeItem(key);
  }

  
  getUser(): User {
    return this.get("User", null);
  }

  public parseDate(date: Date, fmt: string): String {
    //debugger;
    let ret;
    const opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString()          // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
    };
    return fmt;
  }
}
