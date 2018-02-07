import { Component } from '@angular/core';
import { NavController, AlertController, ModalController } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { ProfilePage } from '../profile/profile';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private googlePlus: GooglePlus,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController
  ) {

  }

  /**
   * Perform Google authentication
   */
  signInWithGoogle() {
    this.googlePlus.login({
      'webClientId': '1004371791417-1fqtb5uppq99qdesjk85gonrfu24c9oi.apps.googleusercontent.com',
      'offline': true
    })
      .then((res) => {
        console.log(res);
        this.presentProfileInfo(res);
      })
      .catch((err) => {
        console.error(err);
        this.showSignInError();
      });
  }

  presentProfileInfo(profile: any) {
    let modal = this.modalCtrl.create(ProfilePage, {
      profile: profile
    });
    modal.present();
  }

  /**
   * Display sign in error
   */
  showSignInError() {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'Unable to sign in through Google. Please try again.',
      buttons: ['OK']
    });
    alert.present();
  }

}
