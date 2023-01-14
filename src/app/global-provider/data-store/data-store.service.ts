import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { DATABASESETTINGS } from '../constant/constant';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService extends Dexie {

  constructor() {
    super(DATABASESETTINGS.DATABASENAME);                     
    console.log("database connection")
    this.version(1).stores({
      clients: '++id, name, date_of_birth, birth_time, phone_number,address,city, state, cuntry, email',
    });

    this.version(2).stores({
      user : '++id,email,password'
    });

    this.open()                             //opening the database
    .then(res => console.log(res))
    .catch(err => console.error(err.message));
   }

}
