import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../../../config/config';
import { LoginService } from '../../../services/login/login.service';

declare var swal;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  page: string;

  email: string;

  constructor(
    private router: Router,
    private http: HttpClient,
    public loginService: LoginService
  ) {
    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd ) {
        this.page = event.url;
      }
    });
   }

  ngOnInit() {
  }

  subscribeNewsletter() {
    const url = BACKEND_URL + '/newsletter/subscribe';

    const body = {
      email: this.email
    };

    this.http.post(url, body).subscribe( (res: any) => {
      if (res.ok) {
        swal({
          title: 'Subscripción completada',
          text: res.message,
          icon: 'success',
          timer: 2000
        });
        this.email = '';
      } else {
        swal('Error', res.message, 'error');
      }
    } );
  }

}
