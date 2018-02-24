import { GapiHandlerProvider } from './../../providers/gapi-handler/gapi-handler';
import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  userInfo: any;
  driveAbout: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private ngZone: NgZone,
    private gapiHandler: GapiHandlerProvider) {
  }

  ionViewDidLoad() {
    console.log(this.navParams);
    this.userInfo = this.navParams.data.profile;
    this.gapiHandler.loadGapiClientLibraries().subscribe(() => {
      console.log('Google client libs loaded successfully');
    });
  }

  accessExpenseTracker() {
    this.gapiHandler.listExcelFiles().subscribe((about: any) => {
      this.ngZone.run(() => {
        this.driveAbout = about.result.user;
      });
    });
  }

}
