import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login/login.service';
import { Phone } from '../../../models/phone.model';

import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  phone: Phone = new Phone();

  windowRef: any;

  constructor(
    private loginService: LoginService
  ) { }

  ngOnInit() {
    // firebase.auth().languageCode = 'es';

    // this.windowRef = this.loginService.windowRef;
    // window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
    //   'size': 'invisible',
    //   'callback': function(response) {
    //     // reCAPTCHA solved, allow signInWithPhoneNumber.
    //     onSignInSubmit();
    //   }
    // });

    // this.windowRef.recaptchaVerifier.render();
  }

  login() {
    if (this.phone.line) {
      const phoneNumber = this.phone.getPhoneNumer();
      this.loginService.login(phoneNumber);
    }
  }


}
