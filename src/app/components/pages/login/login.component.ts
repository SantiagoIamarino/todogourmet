import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login/login.service';
import { Phone } from '../../../models/phone.model';

import * as firebase from 'firebase';

declare function hideModal();

import sweetAlert from 'sweetalert';
import { User } from '../../../models/user.model';
import { CartService } from '../cart/cart.service';
import { GobAPIService } from '../../../services/gob-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  phone: Phone = new Phone();

  windowRef: any;

  verificationCode: string;
  numberError = false;
  showLogin = true;

  moreHours = false;

  user: User =  new User();

  cartProductsLength = 0;

  provincias = [];

  showCart = true;

  lastHour = {
    hour: '',
    moreHours: ''
  };

  constructor(
    public loginService: LoginService,
    public cartService: CartService,
    public gobAPIService: GobAPIService,
    public router: Router
  ) {
    this.cartService.isOnCart.subscribe( showCart => {
      this.showCart = showCart;
    } );
  }

  ngOnInit() {
    this.windowRef = this.loginService.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

    this.windowRef.recaptchaVerifier.render();
  }

  resetPhone() {
    this.phone = new Phone();
    this.windowRef.confirmationResult = null;
    this.numberError = false;
  }

  // tslint:disable: radix
  birthDayCompletation() {
    if (this.user.birthDay.length === 2) {
      if (parseInt(this.user.birthDay) > 31) {
        this.user.birthDay = '31';
      }

      this.user.birthDay += '-';
      return;
    }

    if (this.user.birthDay.length === 5) {
      const stringSplitted = this.user.birthDay.split('-');
      if (parseInt(stringSplitted[1]) > 12) {
        this.user.birthDay = stringSplitted[0] + '-' + '12';
      }
      this.user.birthDay += '-';
      return;
    }

    if (this.user.birthDay.length === 10) {
      const stringSplitted = this.user.birthDay.split('-');
      if (parseInt(stringSplitted[2]) > new Date().getFullYear()) {
        this.user.birthDay = stringSplitted[0] + '-' + stringSplitted[1] + '-' + new Date().getFullYear().toString();
      }

      if (parseInt(stringSplitted[2]) < 1900) {
        this.user.birthDay = stringSplitted[0] + '-' + stringSplitted[1] + '-' + '1900';
      }
      return;
    }
  }

  sendLoginCode() {

    const appVerifier = this.windowRef.recaptchaVerifier;

    if (!this.phone.prefix) {
      sweetAlert(
        'Error',
        'Debes ingresar un prefijo',
        'error'
      );
      return;
    }

    if (!this.phone.line) {
      sweetAlert(
        'Error',
        'Debes ingresar un numero valido',
        'error'
      );
      return;
    }

    const num: any = this.phone.getPhoneNumer();


    firebase.auth().signInWithPhoneNumber(num, appVerifier)
            .then(result => {

                this.windowRef.confirmationResult = result;
                this.showLogin = false;
            })
            .catch( error => {
              this.numberError = true;
            } );

  }

  handleHorario(index: number, type = 'normal') {

    if (type === 'more') {

      // if typed a letter

      const lastLetter: any = this.user.hours[index].moreHours.hour[this.user.hours[index].moreHours.hour.length - 1];

      if (isNaN(lastLetter) && this.user.hours[index].moreHours.hour.length > this.lastHour.moreHours.length) {
        const hourWithoutLetter = this.user.hours[index].moreHours.hour.substring(0, this.user.hours[index].moreHours.hour.length - 1);
        this.user.hours[index].moreHours.hour = hourWithoutLetter + '0';
      }

      if (this.user.hours[index].moreHours.hour.length === 2) {
        this.user.hours[index].moreHours.hour += ':';
      }

      if (this.user.hours[index].moreHours.hour.length === 5
        && this.user.hours[index].moreHours.hour.length > this.lastHour.moreHours.length) {
        this.user.hours[index].moreHours.hour += ' a ';
      }

      if (this.user.hours[index].moreHours.hour.length === 10) {
        this.user.hours[index].moreHours.hour += ':';
      }

      this.lastHour.moreHours = this.user.hours[index].moreHours.hour;
      return;
    }

    // if typed a letter

    const lastLetter: any = this.user.hours[index].hour[this.user.hours[index].hour.length - 1];

    if (isNaN(lastLetter) && this.user.hours[index].hour.length > this.lastHour.hour.length) {
      const hourWithoutLetter = this.user.hours[index].hour.substring(0, this.user.hours[index].hour.length - 1);
      this.user.hours[index].hour = hourWithoutLetter + '0';
    }

    if (this.user.hours[index].hour.length === 2) {
      this.user.hours[index].hour += ':';
    }

    if (this.user.hours[index].hour.length === 5
      && this.user.hours[index].hour.length > this.lastHour.hour.length) {
      this.user.hours[index].hour += ' a ';
    }

    if (this.user.hours[index].hour.length === 10) {
      this.user.hours[index].hour += ':';
    }

    this.lastHour.hour = this.user.hours[index].hour;
  }

  // tslint:disable: radix
  cuitCompletation() {
    if (this.loginService.user.cuit.length === 2) {
      this.loginService.user.cuit += '-';
      return;
    }

    if (this.loginService.user.cuit.length === 11) {
      this.loginService.user.cuit += '-';
      return;
    }
  }

  additionalInfo(form) {
    this.loginService.additionalInfo(form);
  }

  getProvinces() {
    return new Promise( (resolve, reject) => {
      this.gobAPIService.getProvinces().subscribe( (res: any) => {
        this.provincias = res.provincias;
        resolve();
      } );
    } );
  }

  verifyLoginCode() {
    this.windowRef.confirmationResult
        .confirm(this.verificationCode)
        .then( result => {
          this.user = result.user;
          this.loginService.getUser(this.user.phoneNumber).subscribe( (res: any) => {
            this.getProvinces().then( () => {
              if (res.user) {
                this.loginService.login(this.user).then( () => {
                  sweetAlert({
                    title: 'Inicio de sesión',
                    text: 'Iniciaste sesión correctamente!',
                    icon: 'success',
                    timer: 2000
                  });
                  this.cartService.getProductsLength();
                });
              } else {
                this.loginService.register(this.user).then( () => {
                  sweetAlert({
                    title: 'Inicio de sesión',
                    text: 'Iniciaste sesión correctamente!',
                    icon: 'success',
                    timer: 2000
                  });
                  this.cartService.getProductsLength();
                } );
              }
            } );
          } );

          hideModal();
      })
    .catch( error => {
      sweetAlert(
        'Error',
        'El codigo ingresado no es correcto, intenta nuevamente',
        'error'
       );
    });
  }


}
