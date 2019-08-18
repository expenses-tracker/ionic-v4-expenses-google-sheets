import { Component } from '@angular/core';
import { Platform, Config } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { Push, PushOptions, PushObject } from '@ionic-native/push';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, config: Config,
    private push: Push) {
    platform.ready().then(() => {
      config.set('mode', 'ios');
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // to check if we have permission
      this.push.hasPermission()
      .then((res: any) => {
        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We do not have permission to send push notifications');
        }
      });

      // Create a channel (Android O and above). You'll need to provide the id, description and importance properties.
this.push.createChannel({
  id: "testchannel1",
  description: "My first test channel",
  // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
  importance: 3
 }).then(() => console.log('Channel created'));
 
 // Delete a channel (Android O and above)
 this.push.deleteChannel('testchannel1').then(() => console.log('Channel deleted'));
 
 // Return a list of currently configured channels
 this.push.listChannels().then((channels) => console.log('List of channels', channels));

 // to initialize push notifications

const options: PushOptions = {
  android: {},
  ios: {
      alert: 'true',
      badge: true,
      sound: 'false'
  },
  windows: {},
  browser: {
      pushServiceURL: 'http://push.api.phonegap.com/v1/push'
  }
};

const pushObject: PushObject = this.push.init(options);


pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
    });
  }
}

