import { Injectable, EventEmitter } from '@angular/core';
import { BACKEND_URL } from '../../../config/config';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../../../services/login/login.service';
import { ConfigurationService } from '../admin/configuration.service';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartProductsLength = 0;

  isOnCart = new EventEmitter();

  locations = [];

  constructor(
    private http: HttpClient,
    private loginService: LoginService,
    private configurationService: ConfigurationService
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

  addProductToCart( product, lastStock ) {

    let url = BACKEND_URL + '/checkout/add-to-cart';
    url += '?token=' + this.loginService.token;

    const productToAdd = {
      productId: product._id,
      quantity: product.quantity,
      lastStock,
      stock: lastStock,
      stockChanged: false
    };

    return new Promise( (resolve, reject) => {
      if (product.estaRefrigerado) {
        const subscriber =
        this.configurationService.getLocations().subscribe( (res: any) => {
          if (res.locations.length !== this.locations.length) {
            this.locations = [];
            res.locations.forEach((location: any) => {
              this.locations.push(location.localidad);
            });
          }

          if (this.locations.indexOf(this.loginService.user.localidad.nombre) > -1) {

            this.http.post(url, productToAdd).subscribe( resp => {
              resolve(resp);
            } );
          } else {
            reject('No se realizan envios de productos refrigerados a tu localidad, lo sentimos!');
          }

        } );
      } else {
        this.http.post(url, productToAdd).subscribe( resp => {
          resolve(resp);
        } );
      }
    } );
  }

  updateCartProduct( product ) {

    let url = BACKEND_URL + '/checkout/cart/' + product._id;
    url += '?token=' + this.loginService.token;

    return this.http.put(url, product);
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

    if (this.loginService.user.localidad.id === '06357110003' && subtotal < parseInt(shippingConfig.minValueToShipment)) {
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
