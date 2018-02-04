import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private googlePlus: GooglePlus
  ) {

  }

  signInWithGoogle() {
    this.googlePlus.login({
      'webClientId': '1004371791417-1fqtb5uppq99qdesjk85gonrfu24c9oi.apps.googleusercontent.com',
      'offline': true
    })
  .then(res => console.log(res))
  .catch(err => console.error(err));
  }

}
