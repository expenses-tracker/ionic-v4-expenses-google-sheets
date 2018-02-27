import { LoginDetailPage } from './../login-detail/login-detail';
import { Observable } from 'rxjs/observable';
import { StorageHandlerProvider } from './../../providers/storage-handler/storage-handler';
import { ListPage } from './../list/list';
import { GapiHandlerProvider } from './../../providers/gapi-handler/gapi-handler';
import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, Platform, LoadingController, Loading } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  loader: Loading;
  files = ['Expense tracker - 2018', 'Expense tracker - 2017', 'Logins'];
  loadFiles: boolean = false;
  title: string = 'Select file';
  selectedFile: string;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private gapiHandler: GapiHandlerProvider,
    private plt: Platform,
    private storage: StorageHandlerProvider,
    public loadingCtrl: LoadingController) {
  }

  ionViewWillEnter(){
    this.plt.ready().then(() => {
      this.presentLoading();
      this.loadProfile();
    });
  }

  private loadProfile() {
    // this.isProfileAvailable().subscribe((resp) => {
    //   console.log('Trying silent login');
    //   this.gapiHandler.trySilentLogin(null,
    //     '1004371791417-1fqtb5uppq99qdesjk85gonrfu24c9oi.apps.googleusercontent.com')
    //     .subscribe((resp) => {
    //       this.loadProfileNLibs(resp);
    //     }, (err) => {
    //       console.log('Failure in silent login');
    //       this.signInWithGoogle();
    //     });
    // }, (err) => {
    //   console.log('No user information found. Fresh login');
      this.signInWithGoogle();
    // });
  }

  private isProfileAvailable() {
    return new Observable((subscriber) => {
      this.storage.get('expenseUser').then((profile) => {
        console.log('LocalStorage get');
        // console.log(profile);
        if(profile != null) {
          subscriber.next(true);
        } else {
          subscriber.error(false);
        }
      }).catch((err) => {
        subscriber.error(false);
      });
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
        this.loadProfileNLibs(res);
      },(err) => {
        console.error(err);
        this.showSignInError();
      });
  }

  public loadProfileNLibs(res) {
    this.presentLoading();
        this.storage.set('expenseUser', res).then((data: any) => {
          console.log('Profile stored successfully for later use');
        }).catch(err => {
          console.log('Unable to profile info in storgae. Error: ' + JSON.stringify(err));
        });
        // console.log(res);
        this.gapiHandler.loadGapiClientLibraries().subscribe(() => {
          console.log('Google client libs loaded successfully');
          this.loader.dismissAll();
          // this.presentProfileInfo(res);
          this.loadFiles = true;
        }, (err) => {
          this.showSignInError();
        });
  }

  loadSheets() {
    let modal = this.modalCtrl.create(ListPage, {
      fileName: this.selectedFile
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
      buttons: [{
        text: 'Retry',
        handler: () => {
          this.loadProfile();
        }
      }]
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

  public fileSelected(item) {
    this.selectedFile = item;
    if(this.selectedFile === 'Logins') {
      this.loadLoginDetail();
    } else {
      this.loadSheets();
    }
  }

  public loadLoginDetail() {
    let modal = this.modalCtrl.create(LoginDetailPage);
    modal.present();
  }

}
