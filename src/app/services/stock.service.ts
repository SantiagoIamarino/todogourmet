import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../config/config';
import { LoginService } from './login/login.service';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) { }

  getStockAlerts() {
    let url = BACKEND_URL + '/stock-alert';
    url += '?token=' + this.loginService.token;

    return this.http.get(url);
  }
}
