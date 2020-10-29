import { Injectable } from '@angular/core';


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
}
