import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPage } from './login/login.page';
import { SignupPage } from './signup/signup.page';



const routes: Routes = [
  {
    path: 'signup',
    component: SignupPage
  },
  {
    path: 'login',
    component: LoginPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassportPageRoutingModule {}
