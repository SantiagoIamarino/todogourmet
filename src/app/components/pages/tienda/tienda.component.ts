import { Component, OnInit } from '@angular/core';

declare function goToTop(animationTime);

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    goToTop(0);
  }

}
