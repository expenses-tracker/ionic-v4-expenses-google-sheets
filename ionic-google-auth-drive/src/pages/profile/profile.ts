import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var gapi: any;

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    console.log(this.navParams);
    this.userInfo = this.navParams.data.profile;

    gapi.load("client", () => { 
      // now we can use gapi.client
      // ... 
      console.log('gapi.client is now available!');
      gapi.client.setToken({
            access_token: this.userInfo.accessToken,
            error: '',
            expires_in: this.userInfo.expires_in.toString(),
            state: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.metadata'
      });
      gapi.client.load('drive', 'v3').then(() => {
        console.log('drive is available now');
        console.log(gapi.client.getToken());
      });
  });
  }

  accessExpenseTracker() {
    gapi.client.drive.about.get({
      fields: 'user'
      //oauth_token: this.userInfo.accessToken
    }).then((response) => {
      console.log(response);
      this.driveAbout = response.result.user;
      console.log(this.driveAbout);
    });
  }

}
