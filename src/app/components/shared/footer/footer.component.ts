import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  page: string;

  constructor(
    private router: Router
  ) {
    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd ) {
        this.page = event.url;
      }
    });
   }

  ngOnInit() {
  }

}
