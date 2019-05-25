import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the StorageHandlerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageHandlerProvider {

  constructor(private storage: Storage) {
    
  }

  public set(key: string, value: any) {
    return this.storage.set(key, value);
  }

  public get(key: string) {
    return this.storage.get(key);
  }

}
