import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LoginService } from '../../../services/login/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  page = 'home';

  constructor(
    private router: Router,
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

  logout() {
    this.loginService.logout();
  }

}
