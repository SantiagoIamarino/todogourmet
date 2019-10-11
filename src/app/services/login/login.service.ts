import { Injectable } from '@angular/core';

import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() {
    // firebase.auth().languageCode = 'es';
   }

  login( phoneNumber ) {
    
  }

  get windowRef() {
    return window;
  }

}
