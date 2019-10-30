import { Component, OnInit } from '@angular/core';
import { TiendaService } from '../../../services/tienda.service';

declare function goToTop(animationTime);

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent implements OnInit {

  marcas = [];

  certificaciones = [
    {
      nombre: 'Sin tacc',
      filterName: 'sintacc'
    },
    {
      nombre: 'Sin azúcar',
      filterName: 'sinazucar'
    },
    {
      nombre: 'Veganos',
      filterName: 'veganos'
    },
    {
      nombre: 'Orgánicos',
      filterName: 'organicos'
    },
    {
      nombre: 'Convencionales',
      filterName: 'convencionales'
    },
  ];

  rubros = [
    {
      nombre: 'Almacen',
      filterName: 'almacen'
    },
    {
      nombre: 'Dietética',
      filterName: 'dietética'
    },
    {
      nombre: 'Farmacia',
      filterName: 'farmacia'
    },
    {
      nombre: 'Kiosko',
      filterName: 'kiosko'
    },
  ];

  tipos = [
    {
      nombre: 'Infusiones',
      filterName: 'infusiones'
    },
    {
      nombre: 'Snack y Galletitas',
      filterName: 'snackygalletitas'
    },
    {
      nombre: 'Miel y mermeladas',
      filterName: 'mielymermeladas'
    },
    {
      nombre: 'Lacteos',
      filterName: 'lacteos'
    }
  ];

  constructor(
    private tiendaService: TiendaService
  ) {
    this.tiendaService.getMarcas().subscribe( marcas => {
      this.marcas = marcas;
    } );
   }

  ngOnInit() {
    goToTop(0);
  }

}