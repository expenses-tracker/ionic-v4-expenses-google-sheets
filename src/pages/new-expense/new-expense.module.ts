import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewExpensePage } from './new-expense';

@NgModule({
  declarations: [
    NewExpensePage,
  ],
  imports: [
    IonicPageModule.forChild(NewExpensePage),
  ],
})
export class NewExpensePageModule {}
