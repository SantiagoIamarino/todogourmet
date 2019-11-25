import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../../../config/config';
import { LoginService } from '../../../services/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) { }

  getOrders() {
    let url = BACKEND_URL + '/orders';
    url += '?token=' + this.loginService.token;

    return this.http.get(url);
  }
}
