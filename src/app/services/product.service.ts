import { Injectable, EventEmitter } from '@angular/core';
import { Product } from '../models/product.model';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { LoadingService } from '../components/shared/loading/loading.service';
import { BACKEND_URL } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LoginService } from './login/login.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productsUpdated = new EventEmitter();

  constructor(
    private afs: AngularFirestore,
    private http: HttpClient,
    private loadingService: LoadingService,
    private loginService: LoginService
  ) {
   }

  getProducts(limit: number = 0) {
    let url = BACKEND_URL + '/products';

    if (limit !== 0) {
      url += '?limit=' + limit;
    }

    return this.http.get(url).pipe(
      map( (res: any) => {
        return res.products;
      } )
    );
  }

  getProduct(id: string) {
    const url = BACKEND_URL + '/products/product/' + id;

    return this.http.get(url).pipe(
      map( (res: any) => {
        return res.product;
      } )
    );
  }

  getCertifications(certificaciones) {
    return new Promise((resolve, reject) => {
      const certs = [];

      certificaciones.forEach((certification, index) => {
        const subscriber =
        this.afs.collection('certificaciones', ref =>
        ref.where('formattedFilter', '==', certification).limit(1))
        .valueChanges().subscribe( (DBCert: any) => {
            certs.push(DBCert[0]);

            subscriber.unsubscribe();

            if (index === certs.length - 1) {
              this.loadingService.loading = false;
              resolve(certs);
            }
          } );
      });
    });
  }

  searchProducts( term: string ) {
    const url = BACKEND_URL + '/products/' + term;

    return this.http.get(url);
  }


  uploadProduct( product: Product) {
    let url = BACKEND_URL + '/products';
    url += '?token=' + this.loginService.token;

    return new Promise( (resolve, reject) => {

      const subscriber =
      this.afs.collection('marcas', ref => ref.where('formattedFilter', '==', product.marca))
      .valueChanges().subscribe( (res: any) => {
        product.marca = {
          nombre: res[0].nombre,
          formatted: res[0].formattedFilter
        };

        product.quantity = 1;

        subscriber.unsubscribe();


        this.http.post(url, product).subscribe( (resp: any) => {
          if (resp.product) {
            resolve(resp.product);
          }
        } );

      } );

    } );
  }

  editProduct( product: Product) {
    let url = BACKEND_URL + '/products/' + product._id;
    url += '?token=' + this.loginService.token;

    return new Promise( (resolve, reject) => {
      this.http.put(url, product).subscribe( (res: any) => {
        resolve(res.productUpdated);
      } );
    } );
  }

  deleteProduct( product: Product ) {
    let url = BACKEND_URL + '/products/' + product._id;
    url += '?token=' + this.loginService.token;

    return this.http.delete(url);
  }
}
