import { Injectable, EventEmitter } from '@angular/core';

import * as firebase from 'firebase';

import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingService } from '../../components/shared/loading/loading.service';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  userState = new EventEmitter();

  user: User = new User();

  constructor(
    public afs: AngularFirestore,
    private router: Router,
    public loadingService: LoadingService
  ) {
    this.loadingService.loading = true;

    firebase.initializeApp(environment.firebase);
    firebase.auth().languageCode = 'es';

    firebase.auth().onAuthStateChanged( user => {
      if (user) {
        this.createOrGetUser(user);
      } else {
        this.loadingService.loading = false;
        this.userState.emit('No user');
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

        this.loadingService.loading = false;
        this.userState.emit('User obtained');

      } );
  }

  logout() {
    firebase.auth().signOut().then( res => {
      this.user = new User();
    } );
  }

}
