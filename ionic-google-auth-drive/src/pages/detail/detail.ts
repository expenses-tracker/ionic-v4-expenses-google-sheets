import { GapiHandlerProvider } from './../../providers/gapi-handler/gapi-handler';
import { NewExpensePage } from './../new-expense/new-expense';
import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ModalController } from 'ionic-angular';
import * as _ from 'lodash';

/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  title: string;
  spreadsheetId: any;
  loader: Loading;
  spreadSheetData: any;
  aggregates: any;
  expensesList: Array<{
    id: number,
    date: string,
    description: string,
    paymentType: string,
    amount: string
  }> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private gapiHandler: GapiHandlerProvider,
    private zone: NgZone) {
    this.presentLoading();
    this.loadData();
  }

  ionViewDidLoad() {
    // console.log(this.spreadSheetData);
    this.loader.dismiss();
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    this.loader.present();
  }

  private loadData() {
    this.title = this.navParams.get('title');
    this.spreadSheetData = this.navParams.get('sheetData');
    this.spreadsheetId = this.navParams.get('spreadsheetId');
    this.loadAggregates();
    this.loadExpenses();
  }

  private loadAggregates() {
    const data = this.spreadSheetData.data[0].rowData[2].values;
    this.aggregates = {
      expenses: data[3].effectiveValue.numberValue,
      household: data[4].effectiveValue.numberValue,
      travel: data[5].effectiveValue.numberValue,
      bills: data[6].effectiveValue.numberValue,
      outsideFoods: data[7].effectiveValue.numberValue,
      shopping: data[8].effectiveValue.numberValue,
      others: data[9].effectiveValue.numberValue
    };
  }

  private loadExpenses() {
    const data = this.spreadSheetData.data[0].rowData;
    for (let index = (data.length - 1); index > 2; index--) {
      const element = data[index].values;
      if (element.length > 3) {
        this.expensesList.push({
          id: index,
          date: element[0].formattedValue,
          description: element[1].formattedValue,
          paymentType: element[2].formattedValue,
          amount: element[3].formattedValue
        });
      }
    }
    // console.log(this.expensesList);
  }

  public editExpense(expense) {
    console.log('Edit expense' + JSON.stringify(expense));
  }

  public addExpense() {
    const expenses = this.spreadSheetData.data[0].rowData;
    const detailModal = this.modalCtrl.create(NewExpensePage, {
      'spreadsheetId': this.spreadsheetId,
      'noOfExpenses': this.expensesList.length + 3,
      'sheet': this.title
    });
    detailModal.onDidDismiss((data) => {
      if(data) {
        if(data.refresh) {
          this.presentLoading();
          this.zone.run(() => {
            this.refreshData();
          });
        }
      }
    });
    detailModal.present();
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.loadExpenses();
      infiniteScroll.complete();
    }, 100);
  }

  private refreshData() {
    this.gapiHandler.getSpreadSheetData(this.spreadsheetId).subscribe((data: any) => {
      const spreadSheetData = data.result.sheets;
      this.spreadSheetData = _.find(spreadSheetData, (o) => { return o.properties.title === this.title });
      this.loader.dismiss();
    });
  }

}
