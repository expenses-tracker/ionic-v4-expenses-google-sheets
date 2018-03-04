import { GapiHandlerProvider } from './../../providers/gapi-handler/gapi-handler';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, AlertController, LoadingController, ViewController } from 'ionic-angular';

/**
 * Generated class for the NewLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-login',
  templateUrl: 'new-login.html',
})
export class NewLoginPage {
  site: string;
  url: string;
  username: string;
  password: string;
  securityQues: string = '';
  loginIdx: number;
  loader: Loading;
  spreadsheetId: string;
  noOfLogins: number;
  public title: string = 'Add Login Detail';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private gapiHandler: GapiHandlerProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController) {
    this.presentLoading();
    this.spreadsheetId = this.navParams.get('spreadsheetId');
    // console.log('SpreadSheetId to search: '+ this.spreadsheetId);
    this.noOfLogins = this.navParams.get('noOfLogins');
    if (this.navParams.get('edit')) {
      this.title = 'Edit Login Detail';
      // console.log(this.navParams.get('expenseData'));
      const login = this.navParams.get('loginData');
      this.site = login.site;
      this.url = login.url;
      this.username = login.username;
      this.password = login.password;
      this.securityQues = login.securityQues;
      this.loginIdx = login.id;
    }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad NewLoginPage');
    this.loader.dismiss();
  }

  ionViewWillUnload(){
   this.loginIdx = undefined;
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  public addLogin() {
    this.presentLoading();
    const body = [
      [this.site],
      [this.url],
      [this.username],
      [this.password],
      [this.securityQues]];
  
    // Set the range for update
    const range: string = this.navParams.get('sheet') + '!A' + (this.noOfLogins + 1) + ':E' + (this.noOfLogins + 1);
    this.gapiHandler.addRowDatatoSpreadSheet(this.spreadsheetId, range, body).subscribe((data: any) => {
      // console.log(data);
      this.loader.dismiss();
      this.viewCtrl.dismiss({refresh: true});
    }, (err) => {
      console.log(err);
      this.showError(err);
    });
  }

  public editLogin() {
    this.presentLoading();
    const body = [
      [this.site],
      [this.url],
      [this.username],
      [this.password],
      [this.securityQues]];

    this.loginIdx = this.loginIdx + 1;
    // Set the range for update
    const range: string = this.navParams.get('sheet') + '!A' + this.loginIdx + ':E' + this.loginIdx;
    this.gapiHandler.updateRowDatatoSpreadSheet(this.spreadsheetId, range, body).subscribe((data: any) => {
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
