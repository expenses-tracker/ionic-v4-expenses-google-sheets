import { GapiHandlerProvider } from './../../providers/gapi-handler/gapi-handler';
import { NewExpensePage } from './../new-expense/new-expense';
import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ModalController, AlertController } from 'ionic-angular';
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
    amount: string,
    category: string
  }> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    public alertCtrl: AlertController,
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
    // console.info('loadAggregates');
    // console.debug(data);
    this.aggregates = {
      expenses: data[3].formattedValue,
      household: data[4].formattedValue,
      travel: data[5].formattedValue,
      bills: data[6].formattedValue,
      outsideFoods: data[7].formattedValue,
      shopping: data[8].formattedValue,
    };
    // Sheet where shopping column didn't exist
    if (data && data.length === 9) {
      this.aggregates.shopping = 0;
      this.aggregates.others = data[8].formattedValue;
    }
    // Sheet with both shopping and others
    if (data && data.length > 9) {
      this.aggregates.others = data[9].formattedValue;
    }
  }

  private loadExpenses() {
    this.expensesList = [];
    const data = this.spreadSheetData.data[0].rowData;
    // console.info('loadExpenses');
    // console.debug(this.spreadSheetData);
    let dataCount = data.length -1;
    // if(dataCount > 100) {
    //   dataCount = 100;
    // }
    for (let index = dataCount; index > 2; index--) {
      const element = data[index].values;
      if (element.length > 3) {
        this.expensesList.push({
          id: index,
          date: element[0].formattedValue,
          description: element[1].formattedValue,
          paymentType: element[2].formattedValue,
          amount: element[3].formattedValue,
          category: this.identifyCategory(element)
        });
      }
    }
    // console.log(this.expensesList);
  }

  public editExpense(expense) {
    // console.log('Edit expense' + JSON.stringify(expense));
    const detailModal = this.modalCtrl.create(NewExpensePage, {
      'spreadsheetId': this.spreadsheetId,
      'noOfExpenses': this.expensesList.length + 3,
      'sheet': this.title,
      'edit': true,
      'expenseData': expense
    });
    detailModal.onDidDismiss((data) => {
      if(data) {
        if(data.refresh) {
          this.presentLoading();
          this.refreshData();
        }
      }
    });
    detailModal.present();
  }

  public addExpense() {
    const detailModal = this.modalCtrl.create(NewExpensePage, {
      'spreadsheetId': this.spreadsheetId,
      'noOfExpenses': this.expensesList.length + 3,
      'sheet': this.title,
      'edit': false
    });
    detailModal.onDidDismiss((data) => {
      if(data) {
        if(data.refresh) {
          this.presentLoading();
          this.refreshData();
        }
      }
    });
    detailModal.present();
  }

  public deleteExpense(expense) {
    this.presentLoading();
    const range: string = this.title + '!A' + (expense.id + 1) + ':K' + (expense.id + 1);
    this.gapiHandler.deleteDataInSpreadSheet(this.spreadsheetId, range).subscribe((data: any) => {
       this.refreshData();
    }, (err) => {
      this.showError(err);
    });
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

  private refreshData() {
    this.gapiHandler.getSpreadSheetData(this.spreadsheetId).subscribe((data: any) => {
      const spreadSheetData = data.result.sheets;
      this.zone.run(() => {
        this.spreadSheetData = _.find(spreadSheetData, (o) => { return o.properties.title === this.title });
        this.loadAggregates();
        this.loadExpenses();
      });
      this.loader.dismiss();
    });
  }

  private identifyCategory(expense: Array<any>) {
    const defaultCategorues = ['Household', 'Travel', 'Bills', 'Outside Food', 'Shopping', 'Others'];
    const expenseDataLength = expense.length;
    const categoryIdx = expenseDataLength - 5;
    const category = defaultCategorues[categoryIdx];
    return category;
  }

}
