import { LoginDetailPage } from './../login-detail/login-detail';
import { Observable } from 'rxjs/Observable';
import { StorageHandlerProvider } from './../../providers/storage-handler/storage-handler';
import { ListPage } from './../list/list';
import { GapiHandlerProvider } from './../../providers/gapi-handler/gapi-handler';
import { Component, NgZone } from '@angular/core';
import { NavController, AlertController, ModalController, Platform, LoadingController, Loading } from 'ionic-angular';
import { AppConstants } from '../../app/appconstants';
import * as _ from 'lodash';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  loader: Loading;
  files = ['Expense tracker - 2019', 'Expense tracker - 2018', 'Expense tracker - 2017', 'Logins'];
  loadFiles: boolean = false;
  title: string = '';
  selectedFile: any;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private gapiHandler: GapiHandlerProvider,
    private plt: Platform,
    private storage: StorageHandlerProvider,
    public loadingCtrl: LoadingController,
    private zone: NgZone) {
  }

  ionViewWillEnter(){
    this.plt.ready().then(() => {
      this.presentLoading();
      this.loadProfile();
    });
  }

  private loadBrowserLibsNUserInfo(isRefresh: boolean) {
    console.log('loadBrowserLibsNUserInfo invoked');
    setTimeout(() => {
      this.gapiHandler.loadClientLibs(
        null,
        AppConstants.webClientId,
        isRefresh
      ).subscribe((data: any) => {
        this.storage.set('expenseUser', data);
        //console.log(`Userinfo: ${JSON.stringify(data)}`);
        this.title = `, ${data.w3.ofa}`;
        console.log('Libs loaded and user authentication complete');
        setTimeout(() => {
          this.gapiHandler.loadDriveNSheetsLibs().subscribe(() => {
            this.gapiHandler.listExcelFiles().subscribe((data: any) => {
              const filesList = data.result.files;
              //console.log(data.result.files);
              this.files = _.filter(filesList, (o) => { return _.startsWith(o.name,'Expense tracker') });
              if(this.loader) this.loader.dismissAll();
              // this.presentProfileInfo(res);
              this.zone.run(() => {
                this.loadFiles = true;
              });
            });
          });
        }, 1000);
      });
    }, 1000);
  }

  private loadProfile() {
    console.log(`platforms: ${JSON.stringify(this.plt.platforms())}`);
    this.isProfileAvailable().subscribe((resp) => {
      if (this.plt.is(AppConstants.cordova)) {
        console.log('Trying silent login');
        this.gapiHandler.trySilentLogin(null,
          AppConstants.webClientId)
          .subscribe((resp) => {
            this.loadProfileNLibs(resp);
          }, (err) => {
            console.log('Failure in silent login');
            this.signInWithGoogle();
          });
      } else {
        console.log('browser flow');
        this.loadBrowserLibsNUserInfo(false);
      }
    }, (err) => {
      console.log('No user information found. Fresh login');
      if (this.plt.is(AppConstants.cordova)) {
        this.signInWithGoogle();
      } else {
        console.log('browser flow');
        this.loadBrowserLibsNUserInfo(true);
      }
    });
  }

  private isProfileAvailable() {
    return new Observable((subscriber) => {
      this.storage.get('expenseUser').then((profile) => {
        console.log('LocalStorage get');
        //console.log(profile);
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
      AppConstants.webClientId)
      .subscribe((res) => {
        this.loadProfileNLibs(res);
      },(err) => {
        console.error(err);
        this.showSignInError();
      });
  }

  public loadProfileNLibs(res) {
    this.presentLoading();
    this.title = `, ${res.givenName}`;
        this.storage.set('expenseUser', res).then((data: any) => {
          console.log('Profile stored successfully for later use');
        }).catch(err => {
          console.log('Unable to profile info in storgae. Error: ' + JSON.stringify(err));
        });
        // console.log(res);
        this.gapiHandler.loadGapiClientLibraries().subscribe(() => {
          console.log('Google client libs loaded successfully');
          this.gapiHandler.listExcelFiles().subscribe((data: any) => {
            const filesList = data.result.files;
            //console.log(data.result.files);
            this.files = _.filter(filesList, (o) => { return _.startsWith(o.name,'Expense tracker') });
            if(this.loader) this.loader.dismissAll();
            // this.presentProfileInfo(res);
            this.zone.run(() => {
              this.loadFiles = true;
            });
          });
        }, (err) => {
          this.showSignInError();
        });
  }

  loadSheets() {
    // let modal = this.modalCtrl.create(ListPage, {
    //   fileName: this.selectedFile
    // });
    // modal.present();
    this.navCtrl.push(ListPage, {
      fileName: this.selectedFile.name
    });
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
    // let modal = this.modalCtrl.create(LoginDetailPage);
    // modal.present();
    this.navCtrl.push(LoginDetailPage);
  }

}
