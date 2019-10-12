import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import * as firebase from 'firebase';

import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginService } from '../services/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private loginService: LoginService
  ) {}

  canActivate() {

    return true;
  }

}
