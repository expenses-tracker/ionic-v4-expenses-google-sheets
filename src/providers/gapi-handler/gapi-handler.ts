import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus';
import { Observable } from 'rxjs/Observable';
import { AppConstants } from '../../app/appconstants';

declare var gapi: any;
const gapiScopes: string = AppConstants.defaultGapiScopes;

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
    // console.log('Hello GapiHandlerProvider Provider');
  }

  /**
   * Set scopes value for goole apis
   * @param scopes Scopes for Google APIs
   */
  public setApiScopes(scopes: string) {
    this.clientScopes = scopes;
  }

  public loadClientLibs(scopes: string, clientId: string, isRefresh?:boolean) {
    isRefresh = isRefresh || false;
    return new Observable((subscriber) => {
      this.clientScopes = scopes? scopes: gapiScopes;
    this.clientId = clientId;
    // Loads the client library and the auth2 library together for efficiency.
    // Loading the auth2 library is optional here since `gapi.client.init` function will load
    // it if not already loaded. Loading it upfront can save one network request.
    gapi.load('client', () => {
      // Initialize the client with API key and People API, and initialize OAuth with an
      // OAuth 2.0 client ID and scopes (space delimited string) to request access.
      Promise.resolve(gapi.client.init({
        apiKey: AppConstants.webAPIKey,
        discoveryDocs: [AppConstants.discoveryDriveUrl, AppConstants.discoverySheetsUrl],
        clientId: this.clientId ? this.clientId : AppConstants.webClientId,
        scope: this.clientScopes
      })).then(function () {
        // Listen for sign-in state changes.
        if (isRefresh) {
          console.log(`signing in...`);
          // gapi.auth2.getAuthInstance().signIn();
          Promise.resolve(gapi.auth2.getAuthInstance().signIn()).then(() => {
            const currentUser = gapi.auth2.getAuthInstance().currentUser.get();
            const signedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
            const authResp = currentUser.getAuthResponse(true);
            if (signedIn && authResp) {
              // console.log(`AuthResponse: ${JSON.stringify(authResp)}`);
              // console.log(`SignedIn: ${JSON.stringify(signedIn)}`);
              // console.info(`CurrentUser: ${JSON.stringify(currentUser)}`);
              sessionStorage.setItem('expensetokenexpiry', currentUser.Zi.expires_at);
              subscriber.next(currentUser);
              // subscriber.next(authResp);
            } else {
              subscriber.error();
            }
          }).catch((err) => {
            subscriber.error(err);
          });
        } else {
          const currentUser = gapi.auth2.getAuthInstance().currentUser.get();
          const lastLoginTime = sessionStorage.getItem('expensetokenexpiry');
          console.log(`Token Expiry time is: ${lastLoginTime}`);
          if (lastLoginTime != null) {
            const currTime = Date.now();
            console.log(`current time is: ${currTime}`);
            if (currTime > Number.parseInt(lastLoginTime)) {
              console.log('refreshing auth');
              currentUser.reloadAuthResponse()
                .then((res) => {
                    //console.log(res);
                    sessionStorage.setItem('expensetokenexpiry', currentUser.Zi.expires_at);
                    subscriber.next(currentUser);
                });
                } else {
                  console.log('Token is still valid, not refreshing now!');
                  subscriber.next(currentUser);
                }
          } else {
            console.log('refreshing auth');
              currentUser.reloadAuthResponse()
                .then((res) => {
                    //console.log(res);
                    sessionStorage.setItem('expensetokenexpiry', currentUser.Zi.expires_at);
                    subscriber.next(currentUser);
                });
            //subscriber.next(currentUser);
          }
          
        }
        // gapi.auth2.getAuthInstance().isSignedIn.listen(() => {
        //   const signedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
        //   const authResp = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse(true);
        //   if (signedIn && authResp) {
        //     console.log(authResp);
        //     subscriber.next();
        //     // subscriber.next(authResp);
        //   } else {
        //     subscriber.error();
        //   }
        // });
      });
    });
    });
  }

  public webSignIn() {
    // Ideally the button should only show up after gapi.client.init finishes, so that this
    // handler won't be called before OAuth is initialized.
    gapi.auth2.getAuthInstance().signIn();
  }

  public loadDriveNSheetsLibs() {
    return new Observable((subscriber) => {
      gapi.client.load('drive', 'v3').then(() => {
        console.log('drive-v3 is available now');
        // console.log(gapi.client.getToken());
        gapi.client.load('sheets', 'v4').then(() => {
          console.log('sheets-v4 is available now');
          subscriber.next();
        }).catch((err) => {
          subscriber.error(err);
        });
      }).catch((err) => {
        subscriber.error(err);
      });
    });
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
        'offline': false
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
        'offline': false
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
        //console.log(response);
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
        console.log(response);
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

  public addRowDatatoSpreadSheet(spreadsheetId: string, range: string, body: Array<any>) {
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

  public updateRowDatatoSpreadSheet(spreadsheetId: string, range: string, body: Array<any>) {
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
