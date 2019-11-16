import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { map } from 'rxjs/operators';

import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';
import { LoadingService } from '../components/shared/loading/loading.service';



@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  canActivate() {

    if (this.loginService.user.role === 'ADMIN_ROLE') {
      return true;
    }

    this.router.navigate(['/home']);
    return false;

  }

}
