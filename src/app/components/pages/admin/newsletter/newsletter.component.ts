import { Component, OnInit } from '@angular/core';
import { NewsletterService } from './newsletter.service';

import * as alasql from 'alasql';
import * as XLSX from 'xlsx';

declare var swal;

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements OnInit {

  message: string;

  messages: any[] = [];
  usersSubscribed: any[] = [];

  constructor(
    private newsletterService: NewsletterService
  ) {
    this.getMessages();
    this.getUsersSubscribed();
   }

  ngOnInit() {
  }

  getMessages() {
    this.newsletterService.getMessages().subscribe( messages => {
      this.messages = messages;
    } );
  }

  getUsersSubscribed() {
    this.newsletterService.getUsersSubscribed().subscribe( users => {
      this.usersSubscribed = users;
    } );
  }

  downloadMessages() {
    const opts = [{ sheeitd: 'Usuarios registrados', header: true }];

    // This piece of code will download excel sheet
    alasql("SELECT  userEmail as [Email] INTO XLSX ('Usuarios.xlsx',{headers:true}) FROM ?", [this.usersSubscribed]);
  }

  sendMessage() {
    this.newsletterService.sendMessage(this.message).subscribe( (res: any) => {
      swal('Mensaje enviado', res.message, 'success');
      this.message = '';
    } );
  }

}
