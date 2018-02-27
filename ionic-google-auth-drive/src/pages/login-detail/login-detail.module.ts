import { NewLoginPageModule } from './../new-login/new-login.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginDetailPage } from './login-detail';

@NgModule({
  declarations: [
    LoginDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginDetailPage),
    NewLoginPageModule
  ],
})
export class LoginDetailPageModule {}
