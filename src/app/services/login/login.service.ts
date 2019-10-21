import { Injectable} from '@angular/core';

import * as firebase from 'firebase';

import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  user: User = new User();

  loading = true;

  constructor(
    public afs: AngularFirestore,
    private router: Router
  ) {
    firebase.initializeApp(environment.firebase);
    firebase.auth().languageCode = 'es';

    firebase.auth().onAuthStateChanged( user => {
      if (user) {
        this.createOrGetUser(user);
      } else {
        this.loading = false;
      }
    } );

   }


  get windowRef() {
    return window;
  }

  createOrGetUser( user ) {
    this.afs.collection('users', ref => ref.where('_uid', '==', user.uid)).valueChanges()
      .subscribe( (userDB: any) => {

        if (userDB.length > 0) {
          this.user = userDB[0];
        } else {
          let newUser = new User(user.uid, user.phoneNumber);
          newUser = JSON.parse(JSON.stringify(newUser));

          this.afs.collection('users').add( newUser ).then( res => {
            this.user = newUser;
          } );
        }

        this.loading = false;

      } );
  }

  logout() {
    firebase.auth().signOut().then( res => {
      this.user = new User();
    } );
  }

}
