import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../config/config';
import { LoginService } from './login/login.service';

@Injectable({
  providedIn: 'root'
})
export class SurtidoService {

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) { }

  getSurtido() {
    let url = BACKEND_URL + '/surtido';
    url += '?token=' + this.loginService.token;

    return this.http.get(url);
  }
}
