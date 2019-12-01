import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LoginService } from './login/login.service';

@Injectable({
  providedIn: 'root'
})
export class GobAPIService {

  API_URL = 'https://apis.datos.gob.ar/georef/api';

  localidades: [];

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) { }

  provinceChanged() {

    const provinceId = this.loginService.user.provincia.id;

    this.getProvince(provinceId)
      .then( provincia => {
        this.loginService.user.provincia = provincia;

        this.getLocalidades(provinceId).subscribe(localidades => {
          this.localidades = localidades;
        });

      } );
  }

  localidadChanged() {
    const localidadId = this.loginService.user.localidad.id;

    this.getLocalidad(localidadId)
    .then( localidad => {
      this.loginService.user.localidad = localidad;
    } );
  }

  getProvinces() {
    const url = this.API_URL + '/provincias?campos=id,nombre&max=1000&orden=nombre';

    return this.http.get(url);
  }

  getProvince(provinceId: string) {
    if (!provinceId) {
      return;
    }
    const url = this.API_URL + '/provincias?id=' + provinceId + '&campos=id,nombre&max=1000&orden=nombre';

    return new Promise( (resolve, reject) => {
      this.http.get(url).subscribe( (res: any) => {
        resolve(res.provincias[0]);
      } );
    } );
  }

  getLocalidades(provinceId: string) {
    if (!provinceId) {
      return;
    }
    const url = this.API_URL + '/localidades?provincia=' + provinceId + '&campos=id,nombre&max=1000&orden=nombre';

    return this.http.get(url).pipe( map((res: any) => {
      return res.localidades;
    }) );
  }

  getLocalidad(localidadId: string) {
    if (!localidadId) {
      return;
    }
    const url = this.API_URL + '/localidades?id=' + localidadId + '&campos=id,nombre&max=1000&orden=nombre';

    return new Promise( (resolve, reject) => {
      this.http.get(url).subscribe( (res: any) => {
        resolve(res.localidades[0]);
      } );
    } );
  }
}
