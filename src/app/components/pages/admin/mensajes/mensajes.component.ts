import { Component, OnInit } from '@angular/core';
import { ContactoService } from '../../home/contacto/contacto.service';
import { contactMessage } from '../../../../models/contact-message.model';
import { LoadingService } from '../../../shared/loading/loading.service';

declare var swal;

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent implements OnInit {

  messages: contactMessage[] = [];

  filter = {
    status: '',
    date: '',
    term: ''
  };

  constructor(
    private contactoService: ContactoService,
    private loadingService: LoadingService
  ) {
    this.getMessages();
   }

  ngOnInit() {
  }

  getMessages() {
    this.loadingService.loading = true;

    this.contactoService.getMessages().subscribe( (res: any) => {
      this.messages = res.messages;
      this.loadingService.loading = false;
    } );
  }

  checkAsRead(message: contactMessage, checkAs: boolean) {
    message.readed = checkAs;

    this.contactoService.updateMessage(message).subscribe( (res: any) => {
      swal('Estado del mensaje actualizado', 'Has actualizado el estado del mensaje correctamente!', 'success');

      this.getMessages();
    } );
  }

  handleImportant(message: contactMessage, importantAs: boolean) {
    message.important = importantAs;

    this.contactoService.updateMessage(message).subscribe( (res: any) => {
      swal('Estado del mensaje actualizado', 'Has actualizado el estado del mensaje correctamente!', 'success');

      this.getMessages();
    } );
  }

  applyFilter() {
    if (!this.filter) {
      this.getMessages();
      return;
    }

    const body = {
      status: (this.filter.status) ? false : '',
      important: null,
      date: this.filter.date,
      term: this.filter.term
    };

    if (this.filter.status === 'leidos') {
      body.status = true;
    } else if ( this.filter.status === 'destacados' ) {
      body.status = null;
      body.important = true;
    }

    console.log(body);

    this.contactoService.getMessagesByFilter(body).subscribe( (res: any) => {
      this.messages = res.messages;
    } );
  }

  removeMessage( message: contactMessage ) {

    sweetAlert('Estas seguro que deseas eliminar este mesaje?', {
      buttons: ['Cancelar', 'Aceptar'],
      icon: 'warning'
    }).then( wantsToDelete => {
      if (wantsToDelete) {
        this.contactoService.deleteMessage( message ).subscribe( () => {
          sweetAlert(
            'Mensaje eliminado',
            'El mensaje se ha eliminado correctamente',
            'success'
          );
          this.getMessages();
        });
      }
    } );
  }

}
