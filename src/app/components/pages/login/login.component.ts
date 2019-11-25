import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login/login.service';
import { Phone } from '../../../models/phone.model';

import * as firebase from 'firebase';
import { Router } from '@angular/router';

declare function hideModal();

import sweetAlert from 'sweetalert';
import { User } from '../../../models/user.model';
import { CartService } from '../cart/cart.service';

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

  constructor(
    public loginService: LoginService,
    public cartService: CartService,
    private router: Router
  ) {
  }

  ngOnInit() {
      this.windowRef = this.loginService.windowRef;
      this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

      this.windowRef.recaptchaVerifier.render();
  }

  sendLoginCode() {

    const appVerifier = this.windowRef.recaptchaVerifier;

    if (!this.phone.line) {
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

  changeHour(type, value) {
    this.loginService.changeHour(type, value);
  }

  additionalInfo(form) {
    this.loginService.additionalInfo(form);
  }

  verifyLoginCode() {
    this.windowRef.confirmationResult
        .confirm(this.verificationCode)
        .then( result => {

          this.user = result.user;
          this.loginService.getUser(this.user.phoneNumber).subscribe( (res: any) => {
            if (res.user) {
              this.loginService.login(this.user).then( () => {
                sweetAlert(
                  'Inicio de sesión',
                  'Iniciaste sesión correctamente!',
                  'success'
                );
              });
            } else {
              this.loginService.register(this.user).then( () => {
                sweetAlert(
                  'Inicio de sesión',
                  'Iniciaste sesión correctamente!',
                  'success'
                );
              } );
            }
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
