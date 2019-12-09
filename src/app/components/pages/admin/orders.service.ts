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

  getUserOrders() {
    let url = BACKEND_URL + '/orders/user';
    url += '?token=' + this.loginService.token;

    return this.http.get(url);
  }

  updateOrder(order) {
    let url = BACKEND_URL + '/orders/' + order._id;
    url += '?token=' + this.loginService.token;

    return this.http.put(url, order);
  }

  getUserOrdersByFilter(status: string) {

    let url = BACKEND_URL + '/orders/user/status/' + status;
    url += '?token=' + this.loginService.token;

    return this.http.get(url);
  }

  getOrdersByFilter(status: string) {
    let url = BACKEND_URL + '/orders/status/' + status;
    url += '?token=' + this.loginService.token;

    return this.http.get(url);
  }

}
