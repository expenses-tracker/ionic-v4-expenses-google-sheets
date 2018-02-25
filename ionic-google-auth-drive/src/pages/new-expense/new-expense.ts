import { GapiHandlerProvider } from './../../providers/gapi-handler/gapi-handler';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController, ViewController } from 'ionic-angular';
import * as _ from 'lodash';

/**
 * Generated class for the NewExpensePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-expense',
  templateUrl: 'new-expense.html',
})
export class NewExpensePage {
  loader: Loading;
  spreadsheetId: string;
  noOfExpenses: number;
  paymentTypes: Array<string> = [];
  descriptions: Array<string> = [];
  categories: Array<string> = ['Household', 'Travel', 'Bills', 'Outside Food', 'Shopping', 'Others'];
  date: Date;
  description: string;
  paymentType: string;
  amount: number;
  category: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private gapiHandler: GapiHandlerProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController) {
    this.presentLoading();
    this.spreadsheetId = this.navParams.get('spreadsheetId');
    // console.log('SpreadSheetId to search: '+ this.spreadsheetId);
    this.noOfExpenses = this.navParams.get('noOfExpenses');
    this.getPaymentTypes();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad NewExpensePage');
  }

  private getPaymentTypes() {
    this.gapiHandler.getColumnBasedDataFromSpreadSheet(this.spreadsheetId, 'Drop Downs!A:A').subscribe((data: any) => {
      this.getDescriptions();
      data.result.values.forEach(element => {
        this.paymentTypes.push(element[0]);
      });
      // console.log(this.paymentTypes);
    }, (err) => {
      console.log(err);
      this.loader.dismiss();
      this.showError(err);
    });
  }

  private getDescriptions() {
    this.gapiHandler.getColumnBasedDataFromSpreadSheet(this.spreadsheetId, 'Drop Downs!C:C').subscribe((data: any) => {
      data.result.values.forEach(element => {
        this.descriptions.push(element[0]);
      });
      // console.log(this.descriptions);
      this.loader.dismiss();
    }, (err) => {
      console.log(err);
      this.loader.dismiss();
      this.showError(err);
    });
  }

  public addExpense() {
    this.presentLoading();
    const body = [
      [this.date],
      [this.description],
      [this.paymentType],
      [this.amount],
      [''], [''], [''], [''], [''], ['']];

    // Find index of selected category from categories list
    const categoryIdx = _.findIndex(this.categories, (o) => {
      return o === this.category;
    });
    // set the index of category object to update in body array
    const replaceIdx = 4 + categoryIdx;
    console.log('Replace index: ' + replaceIdx);
    // Replace null with user entered amount for category
    body[replaceIdx] = [this.amount];
  
    // Set the range for update
    const range: string = this.navParams.get('sheet') + '!A' + (this.noOfExpenses + 1) + ':J' + (this.noOfExpenses + 1);
    this.gapiHandler.addDatatoSpreadSheet(this.spreadsheetId, range, body).subscribe((data: any) => {
      // console.log(data);
      this.loader.dismiss();
      this.viewCtrl.dismiss({refresh: true});
    }, (err) => {
      console.log(err);
      this.showError(err);
    });
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    this.loader.present();
  }

  /**
   * Display error
   */
  showError(error: any) {
    const msg = error.result.error.message;
    const title = error.result.error.status;
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

}
