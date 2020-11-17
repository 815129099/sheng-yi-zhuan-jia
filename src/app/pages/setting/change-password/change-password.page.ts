import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { PassportService } from 'src/app/pages/passport/passport.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  isRight = true;
  viewObject = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  constructor(private localStorageService: LocalStorageService, private passportService: PassportService,private router:Router) { }

  ngOnInit() {
  }

  updatePassword() {
    if (this.verifyPassword(this.viewObject.oldPassword)) {
      let user = this.localStorageService.get("User", null);
      this.passportService.updatePassword(user.phone, this.viewObject.newPassword).then((result) => {
        if (result.success) {
          alert("重置成功！");
          this.router.navigateByUrl('setting');
        }
      });
    }
  }

  verifyPassword(oldPassword: any): boolean {
    let user = this.localStorageService.get("User", null);
    if (oldPassword === user.password) {
      this.isRight = true;
      return true;
    }
    this.isRight = false;
    return false;
  }



}
