import { Injectable, EventEmitter } from '@angular/core';
import { Product } from '../models/product.model';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { LoadingService } from '../components/shared/loading/loading.service';
import { BACKEND_URL } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LoginService } from './login/login.service';

declare var swal;

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

  getProducts(currentPage = 1) {
    let url = BACKEND_URL + '/products';

    if (currentPage > 1) {
      url += '?page=' + currentPage;
    }

    return this.http.get(url);
  }

  getAllProducts() {
    let url = BACKEND_URL + '/products';
    url += '?getAll=true';

    return this.http.get(url).toPromise();
  }

  getProduct(id: string) {
    const url = BACKEND_URL + '/products/product/' + id;

    return this.http.get(url).pipe(
      map( (res: any) => {
        return res.product;
      } )
    );
  }

  getDestacados() {
    const url = BACKEND_URL + '/products/destacados';

    return this.http.get(url).pipe(
      map( (res: any) => {
        return res.products;
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

            if (index === certificaciones.length - 1) {
              this.loadingService.loading = false;
              resolve(certs);
              return;
            }
          } );
      });
    });
  }

  getProductsByFilter(marca: string, currentPage = 1) {
    let url = BACKEND_URL + '/products/marca/' + marca;
    url += '?token=' + this.loginService.token;

    url += '&page=' + currentPage;

    return this.http.get(url);
  }

  searchProducts( term: string, currentPage = 1 ) {
    let url = BACKEND_URL + '/products/' + term;

    if (currentPage > 1) {
      url += '?page=' + currentPage;
    }

    return this.http.get(url);
  }


  uploadProduct( product: Product) {
    // console.log(product);
    let url = BACKEND_URL + '/products';
    url += '?token=' + this.loginService.token;

    return new Promise( (resolve, reject) => {

      if (product.marca.formatted) {
        product.marca = product.marca.formatted;
      }

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

  importProducts(products) {
    new Promise( (resolve, reject) => {
      products.forEach((product, index) => {
        const subscriber =
        this.afs.collection('marcas', ref => ref.where('formattedFilter', '==', product.marca))
        .valueChanges().subscribe( (res: any) => {
          product.marca = {
            nombre: res[0].nombre,
            formatted: res[0].formattedFilter
          };

          product.quantity = 1;

          subscriber.unsubscribe();

          if (index === products.length - 1) {
            resolve();
          }
        } );
      });
    } ).then(() => {
       let url = BACKEND_URL + '/products/import';
       url += '?token=' + this.loginService.token;

       this.http.post(url, products).subscribe(() => {
        swal('Productos subidos!', 'Se han cargado correctamente los productos desde el archivo importado', 'success');
       });
    });

  }

  editProduct( product) {
    let url = BACKEND_URL + '/products/' + product._id;
    url += '?token=' + this.loginService.token;

    return new Promise( (resolve, reject) => {
      if (product.marca.formatted) {
        product.marca = product.marca.formatted;
      }
      const subscriber =
      this.afs.collection('marcas', ref => ref.where('formattedFilter', '==', product.marca))
      .valueChanges().subscribe( (res: any) => {
        product.marca = {
          nombre: res[0].nombre,
          formatted: res[0].formattedFilter
        };

        subscriber.unsubscribe();

        this.http.put(url, product).subscribe( (response: any) => {
          resolve(response.productUpdated);
        } );
      });
    } );
  }

  deleteProduct( product: Product ) {
    let url = BACKEND_URL + '/products/' + product._id;
    url += '?token=' + this.loginService.token;

    return this.http.delete(url);
  }
}
