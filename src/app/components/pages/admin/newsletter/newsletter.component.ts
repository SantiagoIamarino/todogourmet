import { Component, OnInit } from '@angular/core';
import { NewsletterService } from './newsletter.service';

declare var swal;

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements OnInit {

  message: string;

  messages: any[] = [];

  constructor(
    private newsletterService: NewsletterService
  ) {
    this.getMessages();
   }

  ngOnInit() {
  }

  getMessages() {
    this.newsletterService.getMessages().subscribe( messages => {
      this.messages = messages;
      console.log(messages);
    } );
  }

  sendMessage() {
    this.newsletterService.sendMessage(this.message).subscribe( (res: any) => {
      swal('Mensaje enviado', res.message, 'success');
      this.message = '';
    } );
  }

}
