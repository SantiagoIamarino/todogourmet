import { Component, OnInit } from '@angular/core';

declare function goToTop(animationTime);

@Component({
  selector: 'app-quienes-somos',
  templateUrl: './quienes-somos.component.html',
  styleUrls: ['./quienes-somos.component.css']
})
export class QuienesSomosComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    goToTop(0);
  }

}
