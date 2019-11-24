import { Injectable } from '@angular/core';
import { BACKEND_URL } from '../../../config/config';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../../../services/login/login.service';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) { }

  getProducts() {
    let url = BACKEND_URL + '/checkout/cart';
    url += '?token=' + this.loginService.token;

    return this.http.get(url);
  }

  addProductToCart( productId, quantity ) {

    let url = BACKEND_URL + '/checkout/add-to-cart';
    url += '?token=' + this.loginService.token;

    const productToAdd = {
      productId,
      quantity
    };

    return this.http.post(url, productToAdd);
  }

  removeProductFromCart(productId: string) {
    let url = BACKEND_URL + '/checkout/cart/' + productId;
    url += '?token=' + this.loginService.token;

    return this.http.delete(url);
  }

  checkOutMP(products) {

    products.forEach(product => {
      product = {
        title: product.productId.name,
        price: product.subtotal,
        quantity: product.quantity
      };
    });

    let url = BACKEND_URL + '/checkout';
    url += '?token=' + this.loginService.token;

    return this.http.post(url, products);
  }
}
