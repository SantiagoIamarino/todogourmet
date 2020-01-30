import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../../../config/config';
import { LoginService } from '../../../services/login/login.service';
import { User } from '../../../models/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) { }

  getUsers() {
    let url = BACKEND_URL + '/users';
    url += '?token=' + this.loginService.token;

    return this.http.get(url);
  }

  updateUser(user: User) {
    let url = BACKEND_URL + '/users';
    url += '?token=' + this.loginService.token;

    return this.http.put(url, user);
  }

  updateOtherUser( user: User ) {
    let url = BACKEND_URL + '/users/' + user._id;
    url += '?token=' + this.loginService.token;

    return this.http.put(url, user);
  }

  getUsersByTerm( term: string ) {
    let url = BACKEND_URL + '/users/search/' + term;
    url += '?token=' + this.loginService.token;

    return this.http.get(url).pipe( map( (res: any) => {
      return res.users;
    } ) );
  }

  deleteUser(userId: string) {
    let url = BACKEND_URL + '/users/' + userId;
    url += '?token=' + this.loginService.token;

    return this.http.delete(url);
  }
}
