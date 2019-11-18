import { Injectable, EventEmitter } from '@angular/core';
import { contactMessage } from '../../../../models/contact-message.model';
import { BACKEND_URL } from '../../../../config/config';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../../../../services/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) { }

  getMessages() {
    let url = BACKEND_URL + '/contact';
    url += '?token=' + this.loginService.token;

    return this.http.get(url);
  }

  uploadMessage( message: contactMessage ) {
    const url = BACKEND_URL + '/contact';

    return this.http.post(url, message);
  }

  deleteMessage( message: contactMessage ) {
    let url = BACKEND_URL + '/contact/' + message._id;
    url += '?token=' + this.loginService.token;
    return this.http.delete(url);
  }
}
