import { Injectable, EventEmitter } from '@angular/core';

import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { LoadingService } from '../../components/shared/loading/loading.service';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../../config/config';


import sweetAlert from 'sweetalert';
declare var swal;
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  userState = new EventEmitter();

  user: User = new User();
  token: string;

  constructor(
    public http: HttpClient,
    private router: Router,
    public loadingService: LoadingService
  ) {
    this.loadingService.loading = true;
    this.getStorage();

    firebase.initializeApp(environment.firebase);
    firebase.auth().languageCode = 'es';
   }


  get windowRef() {
    return window;
  }

  saveInStorage(user, token) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);

    this.token = token;
    this.user = user;
  }

  getStorage() {
    if (localStorage.getItem('user') && localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  }

  destroyStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.token = null;
    this.user = null;
  }

  getCuitAndAddress() {

    return new Promise( (resolve, reject) => {
      swal('Ingresa tu cuit', {
        content: 'input',
      })
      .then((cuit) => {
        if (!cuit) {
          reject('Debes ingresar un cuit');
        } else {
          this.user.cuit = cuit;
          swal('Ingresa la dirección del comercio', {
            content: 'input',
          }).then((address) => {
            if (!address) {
              reject('Debes ingresar la dirección de tu comercio');
            } else {
              this.user.address = address;
              console.log(this.user);
              resolve('Data obtained');
            }
          });
        }
      });
    } );
  }

  getUser(phoneNumber) {
    const url = BACKEND_URL + '/users/' + phoneNumber;


    return this.http.get(url);
  }

  createUser( user ) {
    const url =  BACKEND_URL + '/users/register';

    const userToUpload = new User(
      user.phoneNumber,
      user.role,
      (user.cuit) ? user.cuit : '',
      (user.address) ? user.address : ''
    );

    return new Promise( (resolve, reject) => {
      this.http.post(url, userToUpload).subscribe( (res: any) => {
        if (res.user && res.token) {
          this.saveInStorage(res.user, res.token);
          resolve('User created');
        }
      } );
    } );
  }

  register(user) {

    this.user = user;

    return new Promise( (resolve, reject) => {
      sweetAlert('¿Cual sera tu rol dentro del sitio?', {
        buttons: ['Consumidor final', 'Comercio'],
      }).then( (isCommerce) => {
        if (!isCommerce) {
          this.createUser(this.user).then( () => {
            resolve('Logged and registered like a consumer');
          } );
        } else {
          this.user.role = 'COMMERCE_ROLE';
          this.getCuitAndAddress().then( () => {
            this.createUser(this.user).then( () => {
              resolve('Logged and registered like a commerce');
            } );
          } )
          .catch( message => {
            sweetAlert(message, '', 'error');
            reject(message);
          } );
        }

      } );
    } );
  }

  login( user ) {
    const url = BACKEND_URL + '/users/login';

    return new Promise( (resolve, reject) => {
      this.http.post(url, user).subscribe( (res: any) => {
        if (res.user) {
          this.saveInStorage(res.user, res.token);
          resolve('Logged');
        }
      } );
    } );
  }


  logout() {
    this.destroyStorage();
  }

}
