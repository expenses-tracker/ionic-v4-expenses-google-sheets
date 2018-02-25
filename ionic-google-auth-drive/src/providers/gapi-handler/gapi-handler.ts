import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus';
import { Observable } from 'rxjs/observable';

declare var gapi: any;
const gapiScopes: string = 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/spreadsheets.readonly';

/*
  Generated class for the GapiHandlerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GapiHandlerProvider {

  profile: any;
  authTokenObject: any;
  clientScopes: string;
  clientId: string;

  constructor(
    private googlePlus: GooglePlus) {
    console.log('Hello GapiHandlerProvider Provider');
  }

  /**
   * Set scopes value for goole apis
   * @param scopes Scopes for Google APIs
   */
  public setApiScopes(scopes: string) {
    this.clientScopes = scopes;
  }

  /**
   * Initiate Google sign in flow for app
   * @param scopes Scopes for google apis
   * @param clientId Web client id (for Android & Web)
   */
  public signIn(scopes: string, clientId: string): Observable<any> {
    this.clientScopes = scopes? scopes: gapiScopes;
    this.clientId = clientId;
    return new Observable((subscriber) => {
      this.googlePlus.login({
        'scopes': scopes? scopes : gapiScopes,
        'webClientId': clientId,
        'offline': true
      })
        .then((res) => {
          // console.log(res);
          this.profile = res;
          subscriber.next(res);
        })
        .catch((err) => {
          console.error(err);
          subscriber.error(err);
        });
    });
  }

  public trySilentLogin(scopes: string, clientId: string) {
    this.clientScopes = scopes? scopes: gapiScopes;
    this.clientId = clientId;
    return new Observable((subscriber) => {
      this.googlePlus.trySilentLogin({
        'scopes': scopes? scopes : gapiScopes,
        'webClientId': clientId,
        'offline': true
      })
        .then((res) => {
          // console.log(res);
          this.profile = res;
          subscriber.next(res);
        })
        .catch((err) => {
          console.error(err);
          subscriber.error(err);
        });
    });
  }

  /**
   * Load gapi client and drive v3 libraries
   */
  public loadGapiClientLibraries() {
    return new Observable((subscriber) => {
      gapi.load("client", () => { 
        // now we can use gapi.client
        // ... 
        console.log('gapi.client is now available!');
        gapi.client.setToken({
              access_token: this.profile.accessToken,
              error: '',
              expires_in: this.profile.expires_in.toString(),
              state: this.clientScopes? this.clientScopes : gapiScopes
        });
        gapi.client.load('drive', 'v3').then(() => {
          console.log('drive is available now');
          // console.log(gapi.client.getToken());
          gapi.client.load('sheets', 'v4').then(() => {
            console.log('drive is available now');
            subscriber.next();
          });
        });
    });
    });
  }

  /**
   * Retrieve user information using drive api
   */
  public aboutUser() {
    return new Observable((subscriber) => {
      gapi.client.drive.about.get({
        fields: 'user'
        //oauth_token: this.userInfo.accessToken
      }).then((response) => {
        // console.log(response);
        subscriber.next(response);
      }, err => {
        console.log(err);
        subscriber.error(err);
      });
    });
  }

  /**
   * Retrieve all files of excel type
   */
  public listExcelFiles() {
    return new Observable((subscriber) => {
      gapi.client.drive.files.list({
        q: 'mimeType = \'application/vnd.google-apps.spreadsheet\''
      }).then((response) => {
        // console.log(response);
        subscriber.next(response);
      }).catch((err) => {
        console.log(err);
        subscriber.error(err);
      });
    });
  }

  /**
   * Get the spreadsheet id for an excel
   * @param excelName Name of excel
   */
  public getSpreadSheetIdForExcel(excelName: string) {
    return new Observable((subscriber) => {
      gapi.client.drive.files.list({
        q: 'name = \'' + excelName + '\''
      }).then((response) => {
        const files = response.result.files;
        if(files.length > 0) {
          subscriber.next(files[0]);
        } else {
          subscriber.error(response);
        }
      }).catch((err) => {
        console.log(err);
        subscriber.error(err);
      });
    });
  }

  /**
   * Retrieve data for given spreadsheet id
   * @param id Spreadsheet ID
   */
  public getSpreadSheetData(id: string) {
    return new Observable((subscriber) => {
      gapi.client.sheets.spreadsheets.get({
        spreadsheetId: id,
        includeGridData: true
      }).then((response) => {
        // console.log(response);
        subscriber.next(response);
      }).catch((err) => {
        console.log(err);
        subscriber.error(err);
      })
    });
  }

  public addDatatoSpreadSheet(spreadsheetId: string, range: string, body: Array<any>) {
    return new Observable((subscriber) => {
      gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: 'USER_ENTERED',
        resource: {
          range: range,
          majorDimension: 'COLUMNS',
          values: body
        }
     }).then((response) => {
       console.log(response);
       subscriber.next(response);
     }).catch((err) => {
       console.log(err);
       subscriber.error(err);
     });
    });
  }

  public updateDatatoSpreadSheet(spreadsheetId: string, range: string, body: Array<any>) {
    return new Observable((subscriber) => {
      gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: 'USER_ENTERED',
        resource: {
          range: range,
          majorDimension: 'COLUMNS',
          values: body
        }
     }).then((response) => {
       console.log(response);
       subscriber.next(response);
     }).catch((err) => {
       console.log(err);
       subscriber.error(err);
     });
    });
  }

  public deleteDataInSpreadSheet(spreadsheetId: string, range: string) {
    return new Observable((subscriber) => {
      gapi.client.sheets.spreadsheets.values.clear({
        spreadsheetId: spreadsheetId,
        range: range,
        resource: {}
     }).then((response) => {
       console.log(response);
       subscriber.next(response);
     }).catch((err) => {
       console.log(err);
       subscriber.error(err);
     });
    });
  }

  public getColumnBasedDataFromSpreadSheet(id: string, range: string) {
    return new Observable((subscriber) => {
      gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: id,
        range: range
      }).then((response) => {
        // console.log(response);
        subscriber.next(response);
      }).catch((err) => {
        console.log(err);
        subscriber.error(err);
      })
    });
  }

  public authorizeSpreadSheetCalls() {
    return new Observable((subscriber) => {
      gapi.auth.authorize({ 
        client_id: this.clientId,
        scope: this.clientScopes,
        immediate: true }, authResult => {
        if (authResult && !authResult.error) {
            /* handle succesfull authorization */
        } else {
            /* handle authorization error */
        }
    });        
    });
  }

}
