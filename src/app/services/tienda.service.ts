import { Injectable, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BACKEND_URL } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TiendaService {

  attentionShowed = false;

  filters = {
    marcas: [],
    certificaciones: [],
    rubros: [],
    tipos: []
  };

  notAllowedSubscriber = new EventEmitter();

  constructor(
    private afs: AngularFirestore,
    private http: HttpClient
  ) {
   }

  getFilter(collection) {
    return new Promise( ( resolve, reject ) => {
      this.afs.collection(collection, ref => ref.orderBy('nombre', 'asc'))
        .valueChanges().subscribe( (filter: any) => {
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
        resolve(filter);
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

  getProducts(currentPage = 1) {
    let url = BACKEND_URL + '/products';

    if (currentPage > 1) {
      url += '?page=' + currentPage;
    }

    return this.http.get(url);
  }

  searchByQuery( term: string, currentPage = 1 ) {
    let url = BACKEND_URL + '/products/' + term;

    if (currentPage > 1) {
      url += '?page=' + currentPage;
    }

    return this.http.get(url);
  }

  searchByFilters(filters, deleteRefrigerado = false, currentPage = 1) {
    let url = BACKEND_URL + '/products/search/';

    if (deleteRefrigerado) {
      url += '?deleteRefrigerado=yes';
    }

    filters.page = currentPage;

    return this.http.post(url, filters);
  }

}
