import { Injectable } from '@angular/core';
import { BACKEND_URL } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../../../../services/login/login.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) { }

  getMessages() {
    let url = BACKEND_URL + '/newsletter';
    url += '?token=' + this.loginService.token;

    return this.http.get(url).pipe( map( (res: any) => {
      return res.messages;
    } ) );
  }

  getUsersSubscribed() {
    let url = BACKEND_URL + '/newsletter/users';
    url += '?token=' + this.loginService.token;

    return this.http.get(url).pipe( map( (res: any) => {
      return res.users;
    } ) );
  }


  sendMessage(message: string) {
    let url = BACKEND_URL + '/newsletter/send';
    url += '?token=' + this.loginService.token;

    const body = {
      message
    };

    return this.http.post(url, body);
  }
}
