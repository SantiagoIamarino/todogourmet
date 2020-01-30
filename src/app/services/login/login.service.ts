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

  isCommerce = true;

  constructor(
    public http: HttpClient,
    private router: Router,
    public loadingService: LoadingService
  ) {
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

  additionalInfo(form) {
    if (!form.name && !this.isCommerce) {
      this.returnMessageError('Debes ingresar un nombre');
      return;
    }

    if (!form.dni && !this.isCommerce) {
      this.returnMessageError('Debes ingresar un dni');
      return;
    } else if (isNaN(form.dni) && !this.isCommerce) {
      this.returnMessageError('Debes ingresar un dni numerico');
      return;
    }

    if (!form.commerceName && this.isCommerce) {
      this.returnMessageError('Debes ingresar un nombre de comercio');
      return;
    }

    if (!form.cuit && this.isCommerce) {
      this.returnMessageError('Debes ingresar un cuit');
      return;
    }

    if (!form.userEmail) {
      this.returnMessageError('Debes agregar un email');
      return;
    } else {
      if (form.userEmail.indexOf('@') < 0) {
        this.returnMessageError('El email debe contener @');
        return;
      }
    }

    if (!form.birthDay && !this.isCommerce) {
      this.returnMessageError('Debes agregar una fecha de nacimiento');
      return;
    } else {
      const pattern = /^([0-9]{2})-([0-9]{2})-([0-9]{4})$/;
      if (!pattern.test(form.birthDay) && !this.isCommerce) {
        this.returnMessageError('Debes agregar una fecha de nacimiento valida (Ejemplo: 02-07-1990)');
        return;
      }
    }

    if (!form.address && this.isCommerce) {
      this.returnMessageError('Debes ingresar una de comercio');
      return;
    }

    if (!form.contactPerson && this.isCommerce) {
      this.returnMessageError('Debes ingresar una persona de contacto');
      return;
    }

    if (!form.shippingAddress && !this.isCommerce) {
      this.returnMessageError('Debes ingresar una dirección de entrega');
      return;
    }

    if (!form.address && this.isCommerce) {
      this.returnMessageError('Debes ingresar la dirección del comercio');
      return;
    }

    if (this.isCommerce) {
      let hoursAdded = false;
      let hoursError = '';
      this.user.hours.forEach(hour => {
        if (hour.active) {
          hoursAdded = true;
          if (!hour.hour) {
            hoursError = 'Debes agregar un horario para el ' + hour.day;
            return;
          }
        }
      });

      if (hoursError) {
        this.returnMessageError(hoursError);
      }

      if (!hoursAdded) {
        this.returnMessageError('Debes ingresar un horario de atención');
        return;
      }
    }

    if (!form.provinciaId || !form.localidadId) {
      this.returnMessageError('Especifica tu provincia o localidad');
      return;
    }

    handleAdditionalInfoModal('hide');

    if (!this.isCommerce) {
      this.createUser(this.user).then( () => {
        this.userState.emit('Logged and registered like a consumer');
      } );
    } else {
      this.user.role = 'COMMERCE_ROLE';
      this.createUser(this.user).then( () => {
        this.userState.emit('Logged and registered like a commerce');
      } );
    }

  }

  createUser( user ) {
    const url =  BACKEND_URL + '/users/register';

    const userToUpload = new User(
      user.phoneNumber,
      user.role,
      (user.name) ? user.name : '',
      user.userEmail,
      (user.cuit) ? user.cuit : '',
      (user.address) ? user.address : '',
      (user.shippingAddress) ? user.shippingAddress : '',
      user.hours,
      (user.dni) ? user.dni : '',
      user.provincia,
      user.localidad,
      (user.birthDay) ? user.birthDay : '',
      false,
      [],
      (user.commerceName) ? user.commerceName : '',
      (user.contactPerson) ? user.contactPerson : ''
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

  updateUser( user: User ) {
    let url = BACKEND_URL + '/users';
    url += '?token=' + this.token;

    return this.http.put(url, user);
  }

  register(user) {

    this.user = user;

    const userNew = new User();
    this.user.hours = userNew.hours;

    this.user.provincia = {
      nombre: '',
      id: ''
    };
    this.user.localidad = {
      nombre: '',
      id: ''
    };

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
