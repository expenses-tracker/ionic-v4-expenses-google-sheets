import { NewExpensePageModule } from './../new-expense/new-expense.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailPage } from './detail';

@NgModule({
  declarations: [
    DetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailPage),
    NewExpensePageModule
  ],
})
export class DetailPageModule {}
