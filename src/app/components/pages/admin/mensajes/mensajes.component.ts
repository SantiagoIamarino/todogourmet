import { Component, OnInit } from '@angular/core';
import { ContactoService } from '../../home/contacto/contacto.service';
import { contactMessage } from '../../../../models/contact-message.model';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent implements OnInit {

  messages: contactMessage[] = [];

  constructor(
    private contactoService: ContactoService
  ) {
    this.getMessages();
   }

  ngOnInit() {
  }

  getMessages() {
    this.contactoService.getMessages().subscribe( (messages: any) => {
      this.messages = messages;
    } );
  }

  removeMessage( message: contactMessage ) {

    sweetAlert('Estas seguro que deseas eliminar este mesaje?', {
      buttons: ['Cancelar', 'Aceptar'],
      icon: 'warning'
    }).then( wantsToDelete => {
      if (wantsToDelete) {
        this.contactoService.deleteMessage( message );

        const listener =
          this.contactoService.messageDeleted.subscribe( res => {
            sweetAlert(
              'Mensaje eliminado',
              'El mensaje se ha eliminado correctamente',
              'success'
            );
          });
      }
    } );
  }

}
