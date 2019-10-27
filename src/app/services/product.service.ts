import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private afs: AngularFirestore
  ) {
   }

  getProducts() {
    return this.afs.collection('products').valueChanges();
  }

  getProduct(id: string) {
    return this.afs.collection('products', ref => ref.where('id', '==', id))
      .valueChanges();
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
}
