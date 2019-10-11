import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  page = 'home';

  constructor(private router: Router) {

    router.events.subscribe(event => {

      if (event instanceof NavigationEnd ) {
        this.page = event.url;
      }
    });
  }

  ngOnInit() {
  }

}
