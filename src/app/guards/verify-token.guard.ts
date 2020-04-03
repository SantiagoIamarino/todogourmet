import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { LoginService } from '../services/login/login.service';

declare var swal;

@Injectable({
  providedIn: 'root'
})
export class VerifyTokenGuard implements CanActivate {

  constructor(
    private loginService: LoginService
  ) {}

  canActivate(): Promise<boolean> | boolean {

    const token = this.loginService.token;

    if (!token) {
      return true;
    }

    const payload = JSON.parse( atob(token.split('.')[1]) );

    const tokenExpDate = payload.exp;

    if (this.isExpired(tokenExpDate)) {
      swal('Su sesión ha expirado', 'Debe loguearse nuevamente para continuar', 'error');

      this.loginService.destroyStorage();
      return false;
    }

    this.renewIfNecessary(tokenExpDate);

    return true;
  }

  isExpired(expDate: number) {
    const now = new Date().getTime() / 1000; // Get in seconds

    if (now > expDate) {
      return true;
    } else {
      return false;
    }
  }

  renewIfNecessary(expDate: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const expiration = new Date(expDate * 1000);
      const now = new Date();

      const dateToCompare = new Date(now.setTime(now.getTime() + (4 * 24 * 60 * 60 * 1000 )));

      if (dateToCompare.getTime() < expiration.getTime()) {
        resolve(true);
      } else {
        this.loginService.renewToken().subscribe(
          () => resolve(true),
          () => reject(false)
        );
      }
    });
  }

}
