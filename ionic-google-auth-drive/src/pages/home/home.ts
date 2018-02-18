import { ListPage } from './../list/list';
import { GapiHandlerProvider } from './../../providers/gapi-handler/gapi-handler';
import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, Platform, LoadingController, Loading } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { ProfilePage } from '../profile/profile';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  loader: Loading;

  constructor(
    public navCtrl: NavController,
    private googlePlus: GooglePlus,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private gapiHandler: GapiHandlerProvider,
    private plt: Platform,
    public loadingCtrl: LoadingController) {
      this.plt.ready().then(() => {
        this.presentLoading();
        this.signInWithGoogle();
      });
  }

  /**
   * Perform Google authentication
   */
  signInWithGoogle() {
    this.gapiHandler.signIn(
      null,
      '1004371791417-1fqtb5uppq99qdesjk85gonrfu24c9oi.apps.googleusercontent.com')
      .subscribe((res) => {
        this.presentLoading();
        console.log(res);
        this.gapiHandler.loadGapiClientLibraries().subscribe(() => {
          console.log('Google client libs loaded successfully');
          this.loader.dismissAll();
          this.presentProfileInfo(res);
        });
      },(err) => {
        console.error(err);
        this.showSignInError();
      });
  }

  presentProfileInfo(profile: any) {
    let modal = this.modalCtrl.create(ListPage, {
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

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    this.loader.present();
  }

}
