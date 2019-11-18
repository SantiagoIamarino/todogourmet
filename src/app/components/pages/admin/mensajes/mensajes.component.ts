import { Component, OnInit } from '@angular/core';
import { ContactoService } from '../../home/contacto/contacto.service';
import { contactMessage } from '../../../../models/contact-message.model';
import { LoadingService } from '../../../shared/loading/loading.service';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent implements OnInit {

  messages: contactMessage[] = [];

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
