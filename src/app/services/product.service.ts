import { Injectable, EventEmitter } from '@angular/core';
import { Product } from '../models/product.model';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { LoadingService } from '../components/shared/loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productUpdated = new EventEmitter();

  productDeleted = new EventEmitter();

  constructor(
    private afs: AngularFirestore,
    private loadingService: LoadingService
  ) {
   }

  getProducts() {
    return this.afs.collection('products').valueChanges();
  }

  getProduct(id: string) {
    return this.afs.collection('products', ref => ref.where('id', '==', id))
      .valueChanges();
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
    return this.afs.collection('products',
       ref => ref.orderBy('name')
                 .startAt(term)
                 .endAt(term + '\uf8ff')
    ).valueChanges();
  }

  uploadProduct( product: Product) {

    product.id = new Date().valueOf().toString();

    product = JSON.parse(JSON.stringify(product));

    return this.afs.collection('products').add( product );
  }

  editProduct( product: Product) {

    product = JSON.parse(JSON.stringify(product));

    const subscriber =
      this.afs.collection('products', ref => ref.where('id', '==', product.id))
        .snapshotChanges().subscribe( res => {
          const productDBId = res[0].payload.doc.id;
          const productItem = this.afs.doc('products/' + productDBId);

          productItem.update(product).then( () => {
            this.productUpdated.emit('Product updated');
            subscriber.unsubscribe();
          } );
        } );
  }

  deleteProduct( product: Product ) {
    this.afs.collection('products', ref => ref.where('id', '==', product.id))
        .snapshotChanges().subscribe( res => {
          if (res.length > 0) {
            const productId = res[0].payload.doc.id;
            const productDoc = this.afs.doc('products' + '/' + productId);

            productDoc.delete().then( () => {
              this.productDeleted.emit('Product deleted');
            } );
          }
        });
  }
}
