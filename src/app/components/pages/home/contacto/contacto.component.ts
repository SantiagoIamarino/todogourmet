import { Component, OnInit } from '@angular/core';
import { contactMessage } from '../../../../models/contact-message.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import sweetAlert from 'sweetalert';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styles: []
})
export class ContactoComponent implements OnInit {

  contactMessage: contactMessage = new contactMessage('', '');

  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      lastName: new FormControl(''),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')
      ]),
      phone: new FormControl(''),
      address: new FormControl(''),
      affair: new FormControl(''),
      message: new FormControl('')
    });
   }

  ngOnInit() {
  }

  returnError( error: string ) {
    sweetAlert('Error', error, 'error');
  }

  contactFormSubmit() {
    console.log(this.form);

    if (this.form.valid) {

    } else {

      if (this.form.controls.name.errors) {
        this.returnError('Debes ingresar un nombre');
        return;
      }

      if (this.form.controls.email.errors && this.form.controls.email.errors.required) {
        this.returnError('Debes ingresar un email');
        return;
      } else if (this.form.controls.email.errors && this.form.controls.email.errors.pattern) {
        this.returnError('Debes ingresar un email válido');
        return;
      }
    }

  }

}
