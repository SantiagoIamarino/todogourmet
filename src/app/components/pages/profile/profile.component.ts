import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login/login.service';
import { LoadingService } from '../../shared/loading/loading.service';
import { User } from '../../../models/user.model';
import { GobAPIService } from '../../../services/gob-api.service';

declare var swal;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User = new User();

  moreHours = false;

  provincias = [];

  constructor(
    public loginService: LoginService,
    private loadingService: LoadingService,
    public gobAPIService: GobAPIService
  ) {
    if (this.loginService.user && this.loginService.token) {
      this.user = this.loginService.user;
      this.loadingService.loading = false;
    }

    this.getProvinces();
   }

  ngOnInit() {
    if (this.loginService.user.provincia) {
      this.gobAPIService.provinceChanged();
    }
  }

  changeHour(type, value) {
    this.loginService.changeHour(type, value);
  }

  getProvinces() {
    return new Promise( (resolve, reject) => {
      this.gobAPIService.getProvinces().subscribe( (res: any) => {
        this.provincias = res.provincias;
        resolve();
      } );
    } );
  }

  validation() {
    const validation = {
      valid: false,
      error: ''
    };

    if (!this.user.shippingAddress) {
      validation.error = 'Debes agregar una dirección de entrega';
      return validation;
    }

    if (!this.user.userEmail) {
      validation.error = 'Debes agregar un email';
      return validation;
    } else {
      if (this.user.userEmail.indexOf('@') < 0) {
        validation.error = 'El email debe contener @';
        return validation;
      }
    }

    if (!this.user.phoneNumber) {
      validation.error = 'Debes agregar un celular';
      return validation;
    } else if (this.user.phoneNumber.indexOf('+') < 0) {
      validation.error = 'El numero debe comenzar con +';
      return validation;
    } else {
      const phoneNumber: any = this.user.phoneNumber.split('+')[1];
      // tslint:disable-next-line: radix
      if (isNaN(phoneNumber)) {
        validation.error = 'El numero de telefono debe ser numerico';
        return validation;
      }
    }

    if (!this.user.birthDay) {
      validation.error = 'Debes agregar una fecha de nacimiento';
      return validation;
    } else {
      const pattern = /^([0-9]{2})-([0-9]{2})-([0-9]{4})$/;
      if (!pattern.test(this.user.birthDay)) {
        validation.error = 'Debes agregar una fecha de nacimiento valida (Ejemplo: 02-07-1990)';
        return validation;
      }
    }

    if (!this.user.provincia) {
      validation.error = 'Debes agregar una provincia';
      return validation;
    }

    if (!this.user.localidad) {
      validation.error = 'Debes agregar una localidad';
      return validation;
    }

    if (this.user.role !== 'COMMERCE_ROLE') {
      if (!this.user.name) {
        validation.error = 'Debes agregar un nombre';
        return validation;
      }

      if (!this.user.dni) {
        validation.error = 'Debes agregar un dni';
        return validation;
      } else {
        // tslint:disable-next-line: radix
        if (isNaN(parseInt(this.user.dni))) {
          validation.error = 'El dni debe ser numerico';
          return validation;
        }
      }
    }

    if (this.user.role === 'COMMERCE_ROLE') {
      if (!this.user.commerceName) {
        validation.error = 'Debes agregar el nombre de tu comercio';
        return validation;
      }

      if (!this.user.contactPerson) {
        validation.error = 'Debes agregar una persona de contacto';
        return validation;
      }

      if (!this.user.cuit) {
        validation.error = 'Debes agregar un cuit';
        return validation;
      } else {
        // tslint:disable-next-line: radix
        if (isNaN(parseInt(this.user.cuit))) {
          validation.error = 'El cuit debe ser numerico';
          return validation;
        }
      }
    }

    validation.valid = true;

    return validation;

  }

  updateUser() {

    const validation = this.validation();

    if (validation.valid) {
      this.loginService.updateUser(this.user).subscribe( (res: any) => {
        this.loginService.saveInStorage(this.user, this.loginService.token);
        swal('Usuario actualizado', res.message, 'success');
      } );
    } else {
      swal('Error', validation.error, 'error');
    }

  }

}
