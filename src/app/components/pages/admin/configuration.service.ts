import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../../../config/config';
import { LoginService } from '../../../services/login/login.service';
import { map } from 'rxjs/operators';


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

  sendMessage(message: string) {
    let url = BACKEND_URL + '/newsletter/send';
    url += '?token=' + this.loginService.token;

    const body = {
      message
    };

    return this.http.post(url, body);
  }

  getBannerImages() {
    let url = BACKEND_URL + '/configs/images';
    url += '?token=' + this.loginService.token;

    return this.http.get(url).pipe( map( (res: any) => {
      return res.images;
    } ) );
  }

  getImage(imagePosition: string) {
    let url = BACKEND_URL + '/configs/images/' + imagePosition;
    url += '?token=' + this.loginService.token;

    return this.http.get(url).pipe( map( (res: any) => {
      return res.image;
    } ) );
  }

  updateBannerImage(image: any) {
    let url = BACKEND_URL + '/configs/images';
    url += '?token=' + this.loginService.token;

    return this.http.put(url, image);
  }

}
