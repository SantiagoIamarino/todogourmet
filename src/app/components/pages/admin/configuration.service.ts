import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../../../config/config';
import { LoginService } from '../../../services/login/login.service';


@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) { }

  getConfigs() {
    let url = BACKEND_URL + '/configs';
    url += '?token=' + this.loginService.token;

    return this.http.get(url);
  }

  updateConfig(config) {
    let url = BACKEND_URL + '/configs';
    url += '?token=' + this.loginService.token;

    return this.http.post(url, config);
  }
}
