import { Component, OnInit } from '@angular/core';
import { contactMessage } from '../../../../models/contact-message.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import sweetAlert from 'sweetalert';
import { ContactoService } from './contacto.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {

  contactMessage: contactMessage = new contactMessage('', '');

  form: FormGroup;

  constructor(
    private contactoService: ContactoService
  ) {
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

    if (this.form.valid) {
      this.contactoService.uploadMessage( this.form.value ).then( () => {
        sweetAlert(
          'Mensaje enviado',
          'Mensaje enviado correctamente, en breve responderemos!',
          'success');

        this.form.reset();
      } );
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
