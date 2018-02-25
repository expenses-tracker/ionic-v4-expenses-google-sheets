import { DetailPage } from './../detail/detail';
import { GapiHandlerProvider } from './../../providers/gapi-handler/gapi-handler';
import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ModalController } from 'ionic-angular';
import * as _ from 'lodash';

/**
 * Generated class for the ListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {

  files = ['Expense tracker - 2018', 'Logins'];
  loader: Loading;
  selectedFile: string;
  selectedSheet: string;
  loadFiles: boolean = true;
  sheets: Array<{sheetId: string, title: string}> = [];
  title: string = 'Select file';
  spreadSheetData: any;
  spreadSheetId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private gapiHandler: GapiHandlerProvider,
    public loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private zone: NgZone) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ListPage');
  }

  public fileSelected(item) {
    this.selectedFile = item;
    this.presentLoading();
    this.gapiHandler.getSpreadSheetIdForExcel(item).subscribe((response: any) => {
      // console.log(response.id);
      this.gapiHandler.getSpreadSheetData(response.id).subscribe((data: any) => {
        this.spreadSheetId = data.result.spreadsheetId;
        this.spreadSheetData = data.result.sheets;
        // console.log(this.spreadSheetData);
        this.loadSheets(this.spreadSheetData);
        this.loader.dismiss();
      });
    });
  }

  public sheetSelected(item) {
    this.selectedSheet = item.title;
    let sheetData: any;
    sheetData = _.find(this.spreadSheetData, (o) => { return o.properties.title === this.selectedSheet });
    const detailModal = this.modalCtrl.create(DetailPage, {
      'title': this.selectedSheet,
      'sheetData': sheetData,
      'spreadsheetId': this.spreadSheetId
    });
    detailModal.present();
  }

  private loadSheets(data: any) {
    if(data) {
      data.forEach(element => {
        this.sheets.push({
          sheetId: element.properties.sheetId,
          title: element.properties.title
        });
      });
      this.zone.run(() => {
        this.title = 'Select sheet'
        this.loadFiles = false;
      });
    }
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    this.loader.present();
  }

}
