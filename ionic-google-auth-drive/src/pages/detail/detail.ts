import { GapiHandlerProvider } from './../../providers/gapi-handler/gapi-handler';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';

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
  loader: Loading;
  spreadSheetData: any;
  totalamount: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private gapiHandler: GapiHandlerProvider) {
      this.presentLoading();
    this.title = this.navParams.get('title');
    this.spreadSheetData = this.navParams.get('sheetData');
  }

  ionViewDidLoad() {
    console.log(this.spreadSheetData);
    this.loader.dismiss();
    
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    this.loader.present();
  }

}
