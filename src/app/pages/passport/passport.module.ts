import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PassportPageRoutingModule } from './passport-routing.module';
import { SignupPage } from './signup/signup.page';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PassportPageRoutingModule
  ],
  declarations: [SignupPage]
})
export class PassportPageModule {}
