import { Injectable } from '@angular/core';
import { BACKEND_URL } from '../../../config/config';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../../../services/login/login.service';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartProductsLength = 0;

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) {
    if (this.loginService.user && this.loginService.token) {
      this.getProductsLength();
    }
   }

  getProductsLength() {
    this.getProducts().subscribe( (res: any) => {
      this.cartProductsLength = res.products.length;
    } );
  }

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

  removeAllProducts() {
    let url = BACKEND_URL + '/checkout/cart/remove-all';
    url += '?token=' + this.loginService.token;

    return this.http.delete(url);
  }

  payment(body) {
    let url = BACKEND_URL + '/orders';
    url += '?token=' + this.loginService.token;

    return this.http.post(url, body);
  }

  checkOutMP(products, shippingConfig, subtotal) {

    const productsToSend = [];

    if (this.loginService.user.isMardel && subtotal < parseInt(shippingConfig.minValueToShipment)) {
      const additionalCost = shippingConfig.shippingCost / products.length;

      products.forEach((product, index) => {
        const productToSend = {
          title: product.productId.name,
          price: (product.subtotal + additionalCost) / product.quantity,
          quantity: product.quantity
        };
        productsToSend[index] = productToSend;
      });
    } else {
      products.forEach((product, index) => {
        const productToSend = {
          title: product.productId.name,
          price: product.subtotal / product.quantity,
          quantity: product.quantity
        };
        productsToSend[index] = productToSend;
      });
    }

    let url = BACKEND_URL + '/checkout';
    url += '?token=' + this.loginService.token;

    return this.http.post(url, productsToSend);
  }
}
