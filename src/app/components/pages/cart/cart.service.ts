import { Injectable } from '@angular/core';
import { BACKEND_URL } from '../../../config/config';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private http: HttpClient
  ) { }

  checkOutMP() {

    const product = {
      title: 'Test product',
      price: 300,
      quantity: 1
    };

    const url = BACKEND_URL + '/checkout';

    return this.http.post(url, product);
  }
}
