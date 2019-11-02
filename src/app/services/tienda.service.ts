import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TiendaService {

  filters = {
    marcas: [],

    certificaciones: [
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
      }
    ],
    rubros: [
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
      }
    ],
    tipos: [
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
    ]
  };

  constructor(
    private afs: AngularFirestore
  ) {
   }

  getFilter(collection) {
    return new Promise( ( resolve, reject ) => {
      this.afs.collection(collection).valueChanges().subscribe( (filter: any) => {
        if (collection === 'marcas') {
          this.filters.marcas = filter;
        }
        resolve('Filter');
      } );
    } );
  }

  getAllFilters() {
    return Promise.all([
      this.getFilter('marcas'),
      this.getFilter('certificaciones'),
      this.getFilter('rubros'),
      this.getFilter('tipos')
    ]);
  }

}
