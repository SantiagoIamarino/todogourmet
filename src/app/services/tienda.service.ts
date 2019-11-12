import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TiendaService {

  filters = {
    marcas: [],
    certificaciones: [],
    rubros: [],
    tipos: []
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
        if (collection === 'rubros') {
          this.filters.rubros = filter;
        }
        if (collection === 'certificaciones') {
          this.filters.certificaciones = filter;
        }
        if (collection === 'tipos') {
          this.filters.tipos = filter;
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

  getProducts() {
    return this.afs.collection('products').valueChanges();
  }

}
