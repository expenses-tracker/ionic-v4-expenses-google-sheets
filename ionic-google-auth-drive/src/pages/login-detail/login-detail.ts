import { NewLoginPage } from './../new-login/new-login';
import { GapiHandlerProvider } from './../../providers/gapi-handler/gapi-handler';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController, ModalController } from 'ionic-angular';

/**
 * Generated class for the LoginDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login-detail',
  templateUrl: 'login-detail.html',
})
export class LoginDetailPage {
  loader: Loading;
  spreadSheetData: any;
  spreadSheetId: any;
  labels: any;
  loginData = [];
  filterLoginData = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private gapiHandler: GapiHandlerProvider,
    public loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    public alertCtrl: AlertController) {
      this.loadDetail();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad LoginDetailPage');
  }

  private loadDetail() {
    this.presentLoading();
    this.gapiHandler.getSpreadSheetIdForExcel('Logins').subscribe((response: any) => {
      // console.log(response.id);
      this.gapiHandler.getSpreadSheetData(response.id).subscribe((data: any) => {
        this.spreadSheetId = data.result.spreadsheetId;
        this.spreadSheetData = data.result.sheets;
        // console.log(this.spreadSheetData);
        this.loadLabels();
        this.loadLogins();
        this.loader.dismiss();
      });
    });
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    this.loader.present();
  }

  loadLabels() {
    if (this.spreadSheetData) {
      this.labels = [];
      const titles = this.spreadSheetData[0].data[0].rowData[0].values;
      titles.forEach(element => {
        this.labels.push(element.formattedValue);
      });
      // console.log(this.labels);
    }
  }

  loadLogins() {
    this.loginData = [];
    this.filterLoginData = [];
    const data = this.spreadSheetData[0].data[0].rowData;
    for (let index = 1; index < data.length; index++) {
      const element = data[index].values;
      if (element) {
        if (element.length > 0) {
          const obj = {
            id: index,
            site: element[0].formattedValue,
            url: element[1].formattedValue,
            username: element[2].formattedValue,
            password: element[3].formattedValue,
            securityQues: ''
          };
          if (element.length > 4) {
            obj.securityQues = element[4].formattedValue;
          } 
          this.loginData.push(obj);
          this.filterLoginData.push(obj); 
        }
      }
    }
    // console.log('login data');
    // console.debug(this.loginData);
  }

  addLogin() {
    const addModal = this.modalCtrl.create(NewLoginPage, {
      'spreadsheetId': this.spreadSheetId,
      'noOfLogins': this.loginData.length + 2,
      'sheet': 'Sheet1',
      'edit': false
    });
    addModal.onDidDismiss((data) => {
      if(data) {
        if(data.refresh) {
          this.presentLoading();
          this.loadDetail();
        }
      }
    });
    addModal.present();
  }

  editLogin(login) {
    const detailModal = this.modalCtrl.create(NewLoginPage, {
      'spreadsheetId': this.spreadSheetId,
      'noOfLogins': this.loginData.length + 2,
      'sheet': 'Sheet1',
      'edit': true,
      'loginData': login
    });
    detailModal.onDidDismiss((data) => {
      if(data) {
        if(data.refresh) {
          this.presentLoading();
          this.loadDetail();
        }
      }
    });
    detailModal.present();
  }

  deleteLogin(login) {
    this.presentLoading();
    const range: string = 'Sheet1!A' + (login.id + 1) + ':E' + (login.id + 1);
    this.gapiHandler.deleteDataInSpreadSheet(this.spreadSheetId, range).subscribe((data: any) => {
       this.loadDetail();
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

  getItems(ev: any) {
    // Reset items back to all of the items
    this.filterLoginData = this.loginData;

    // set val to the value of the searchbar
    let val = ev.target.value;
    console.log('value enterd: ' + val);

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.filterLoginData = this.filterLoginData.filter((item) => {
        console.log(item);
        return (item.site && item.site.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

}
