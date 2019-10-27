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

  uploadProduct( product: Product) {

    product.id = new Date().valueOf().toString();

    product = JSON.parse(JSON.stringify(product));

    return this.afs.collection('products').add( product );
  }
}
