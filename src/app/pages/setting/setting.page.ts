import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  constructor(private router:Router,private localStorageService:LocalStorageService) { }

  ngOnInit() {
  }

  public loginout(){
    let logs = []
    this.localStorageService.set("loginLogs",logs);
    this.localStorageService.set("User",null);
    this.router.navigateByUrl('passport/login');
  }

}
