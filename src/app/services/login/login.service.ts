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

declare function handleAdditionalInfoModal(option);


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  userState = new EventEmitter();

  user: User = new User();
  token: string;

  isCommerce = false;

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
    console.log('hecho');
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

  returnMessageError(message) {
    sweetAlert(
      'Error',
      message,
      'error'
    );
  }

  changeHour(type, value) {
    if (type === 'specific') {
      this.user.hours = null;

      const elementExists = this.user.specificHours.indexOf(value);
      if (elementExists > - 1) { // Exists
        this.user.specificHours.splice(elementExists, 1);
      } else {
        this.user.specificHours.push(value);
      }
    } else {
      this.user.specificHours = [];

      this.user.hours = value;
    }
  }

  additionalInfo(form) {
    if (!form.name) {
      this.returnMessageError('Debes ingresar un nombre');
      return;
    }

    if (!form.shippingAddress) {
      this.returnMessageError('Debes ingresar una dirección');
      return;
    }

    if (!form.userEmail) {
      this.returnMessageError('Debes ingresar un email');
      return;
    }

    if (this.isCommerce && !this.user.hours && this.user.specificHours.length <= 0) {
      this.returnMessageError('Debes ingresar un horario de atención');
      return;
    }

    if (!form.isMardel) {
      this.returnMessageError('Especifica tu localidad');
      return;
    }

    handleAdditionalInfoModal('hide');

    if (!this.isCommerce) {
      this.createUser(this.user).then( () => {
        this.userState.emit('Logged and registered like a consumer');
      } );
    } else {
      this.user.role = 'COMMERCE_ROLE';
      this.getCuitAndAddress().then( () => {
        this.createUser(this.user).then( () => {
          this.userState.emit('Logged and registered like a commerce');
        } );
      } )
      .catch( message => {
        sweetAlert(message, '', 'error');
      } );
    }

  }

  createUser( user ) {
    const url =  BACKEND_URL + '/users/register';

    const userToUpload = new User(
      user.phoneNumber,
      user.role,
      user.name,
      user.userEmail,
      (user.cuit) ? user.cuit : '',
      (user.address) ? user.address : '',
      user.shippingAddress,
      (user.specificHours) ? user.specificHours : [],
      (user.hours) ? user.hours : null,
      (user.additionalHours) ? user.additionalHours : null,
      user.isMardel
    );

    delete userToUpload._id;

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

    this.user.specificHours = [];
    this.user.hours = null;

    return new Promise( (resolve, reject) => {
      sweetAlert('¿Cual sera tu rol dentro del sitio?', {
        buttons: ['Consumidor final', 'Comercio'],
      }).then( (isCommerce) => {
        this.isCommerce = isCommerce;
        handleAdditionalInfoModal('show');
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
    window.location.reload();
  }

}
