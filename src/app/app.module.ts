import { LoginDetailPageModule } from './../pages/login-detail/login-detail.module';
import { ListPageModule } from './../pages/list/list.module';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { GooglePlus } from '@ionic-native/google-plus';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { GapiHandlerProvider } from '../providers/gapi-handler/gapi-handler';
import { StorageHandlerProvider } from '../providers/storage-handler/storage-handler';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    ProfilePageModule,
    ListPageModule,
    LoginDetailPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GooglePlus,
    StorageHandlerProvider,
    GapiHandlerProvider,
    StorageHandlerProvider
  ]
})
export class AppModule {}
