import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HomeService } from 'src/app/services/home.service';

declare function sliderMarcas();

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  marcas: any[] = [];

  constructor(
    private homeService: HomeService
  ) {
    this.getMarcas();
   }

  ngOnInit() {
    sliderMarcas();
  }

  getMarcas() {
    this.homeService.getMarcas().subscribe( marcas => {
      this.marcas = marcas;
      console.log(this.marcas);
    } );
  }

}
