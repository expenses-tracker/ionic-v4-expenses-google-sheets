import { GapiHandlerProvider } from './../../providers/gapi-handler/gapi-handler';
import { Component, NgZone } from '@angular/core';
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
    private gapiHandler: GapiHandlerProvider,
    private zone: NgZone) {
      this.presentLoading();
    this.title = this.navParams.get('title');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
    this.gapiHandler.getSpreadSheetData(this.navParams.get('id')).subscribe((data: any) => {
      
      // this.zone.run(() => {
        this.spreadSheetData = data.result.sheets[0];
        console.log(this.spreadSheetData);
      this.totalamount = this.spreadSheetData.data[0].rowData[2].values[3].effectiveValue.numberValue;
      console.log(this.totalamount);
      // });
      this.loader.dismiss();
    });
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    this.loader.present();
  }

}
