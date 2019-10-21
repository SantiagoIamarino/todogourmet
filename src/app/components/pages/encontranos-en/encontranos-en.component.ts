import { Component, OnInit } from '@angular/core';

declare function goToTop(animationTime);

@Component({
  selector: 'app-encontranos-en',
  templateUrl: './encontranos-en.component.html',
  styleUrls: ['./encontranos-en.component.css']
})
export class EncontranosEnComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    goToTop(0);
  }

}
