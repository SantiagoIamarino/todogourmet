import { Injectable, EventEmitter } from '@angular/core';
import { Product } from '../models/product.model';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { LoadingService } from '../components/shared/loading/loading.service';
import { BACKEND_URL } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productsUpdated = new EventEmitter();

  constructor(
    private afs: AngularFirestore,
    private http: HttpClient,
    private loadingService: LoadingService
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

  uploadImages() {

  }

  uploadProduct( product: Product) {
    const url = BACKEND_URL + '/products';

    product.quantity = 1;

    return new Promise( (resolve, reject) => {
      this.http.post(url, product).subscribe( (res: any) => {
        if (res.product) {
          resolve(res.product);
        }
      } );
    } );
  }

  editProduct( product: Product) {
    const url = BACKEND_URL + '/products/' + product._id;

    return new Promise( (resolve, reject) => {
      this.http.put(url, product).subscribe( (res: any) => {
        resolve(res.productUpdated);
      } );
    } );
  }

  deleteProduct( product: Product ) {
    const url = BACKEND_URL + '/products/' + product._id;

    return this.http.delete(url);
  }
}
