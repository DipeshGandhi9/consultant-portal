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
      patients: '++id, name, dob,phoneNumber,location,email',
    });

    this.version(2).stores({
      user : '++id,email,password'
    });

    this.open()                             //opening the database
    .then(res => console.log(res))
    .catch(err => console.error(err.message));
   }

}
