import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../../../config/config';
import { LoginService } from '../../../services/login/login.service';
import { map } from 'rxjs/operators';
import { GobAPIService } from '../../../services/gob-api.service';


@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(
    private http: HttpClient,
    private loginService: LoginService,
    private gobAPIService: GobAPIService
  ) { }

  getConfigs() {
    const url = BACKEND_URL + '/configs';

    return this.http.get(url);
  }

  updateConfig(config) {
    let url = BACKEND_URL + '/configs';
    url += '?token=' + this.loginService.token;

    return this.http.post(url, config);
  }

  getBannerImages() {
    const url = BACKEND_URL + '/configs/images';

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

  getLocations() {
    let url = BACKEND_URL + '/configs/locations';
    url += '?token=' + this.loginService.token;

    return this.http.get(url);
  }

  addLocation(location) {

    const newLocation = {
      provincia: '',
      localidad: ''
    };

    return new Promise( (resolve, reject) => {
      this.gobAPIService.getProvince(location.provincia).then( (provincia: any) => {
        newLocation.provincia = provincia.nombre;
        this.gobAPIService.getLocalidad(location.localidad).then( (localidad: any) => {
          newLocation.localidad = localidad.nombre;

          let url = BACKEND_URL + '/configs/locations';
          url += '?token=' + this.loginService.token;

          return this.http.post(url, newLocation).subscribe( (res: any) => {
            resolve(res.message);
          } );
        } );
      } );
    } );
  }

  deleteLocation(locationId: string) {
    let url = BACKEND_URL + '/configs/locations/' + locationId;
    url += '?token=' + this.loginService.token;

    return this.http.delete(url);
  }

}
