import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login/login.service';
import { Phone } from '../../../models/phone.model';

import * as firebase from 'firebase';
import { Router } from '@angular/router';

declare function hideModal();

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

  user: any;

  constructor(
    private loginService: LoginService,
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
              console.log(error );
             } );

  }

  verifyLoginCode() {
    this.windowRef.confirmationResult
                  .confirm(this.verificationCode)
                  .then( result => {

                    this.user = result.user;
                    this.loginService.createOrGetUser(this.user);
                    this.router.navigate(['/tienda']);
                    console.log(this.user);
                    hideModal();

    })
    .catch( error => console.log(error, 'Incorrect code entered?'));
  }


}
