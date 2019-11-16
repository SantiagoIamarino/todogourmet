import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BACKEND_URL } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

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
    private afs: AngularFirestore,
    private http: HttpClient
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
    const url = BACKEND_URL + '/products/';

    return this.http.get(url).pipe(
      map( (res: any) => {
        return res.products;
      } )
    );
  }

  searchByQuery( term: string ) {
    const url = BACKEND_URL + '/products/' + term;

    return this.http.get(url).pipe(
      map( (res: any) => {
        return res.products;
      })
    );
  }

  searchByFilters(filters) {
    const url = BACKEND_URL + '/products/search/';

    return this.http.post(url, filters).pipe(
      map( (res: any) => {
        return res.products;
      } )
    );
  }

}
