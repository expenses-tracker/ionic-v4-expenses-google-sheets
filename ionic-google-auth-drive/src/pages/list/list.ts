import { DetailPage } from './../detail/detail';
import { GapiHandlerProvider } from './../../providers/gapi-handler/gapi-handler';
import { StorageHandlerProvider } from './../../providers/storage-handler/storage-handler';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ModalController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: StorageHandlerProvider,
    private gapiHandler: GapiHandlerProvider,
    public loadingCtrl: LoadingController,
    private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');
  }

  public fileSelected(item) {
    this.selectedFile = item;
    this.presentLoading();
    this.gapiHandler.getSpreadSheetIdForExcel(item).subscribe((response: any) => {
      console.log(response.id);
      this.loader.dismiss();
       const detailModal = this.modalCtrl.create(DetailPage, {
          'title': this.selectedFile,
          'id': response.id
        });
        detailModal.present();
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
