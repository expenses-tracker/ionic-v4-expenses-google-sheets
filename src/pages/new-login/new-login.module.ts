import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewLoginPage } from './new-login';

@NgModule({
  declarations: [
    NewLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(NewLoginPage),
  ],
})
export class NewLoginPageModule {}
