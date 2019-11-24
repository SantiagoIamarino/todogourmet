import { Component, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { LoadingService } from '../../shared/loading/loading.service';
import { LoginService } from '../../../services/login/login.service';
import { BACKEND_URL } from '../../../config/config';

declare function showButton(preferenceId);

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  preference: any;

  products: any[] = [];

  subtotals = [];
  total = 0;

  postUrl = BACKEND_URL + '/checkout/finished';

  constructor(
    private cartService: CartService,
    public loginService: LoginService,
    public loadingService: LoadingService
  ) {
    this.getProducts();
   }

  ngOnInit() {
  }

  getProducts() {
    this.loadingService.loading = true;
    this.cartService.getProducts().subscribe( (res: any) => {
      this.products = res.products;
      this.loadingService.loading = false;
    } );
  }

  getSubtotal(moreOrLess: string, product) {

    console.log(product);

    if (product.quantity >= 1000) {
      product.quantity = 999;
    }

    if (product.quantity <= 0) {
      product.quantity = 1;
    }

    // tslint:disable: radix

    if (moreOrLess !== 'changed') {
      if (moreOrLess === 'less') {
        if (product.quantity > 1) {
          product.quantity = parseInt(product.quantity) - 1;
        }
      } else {
        product.quantity = parseInt(product.quantity) + 1;
      }
    }

    let price = 0;
    if (this.loginService.user && this.loginService.user.role === 'COMMERCE_ROLE') {
      price = product.precioComercio;
    } else if (product.quantity >= 5) {
      const discount: any = 1 - parseFloat('0.' + product.descuentoPorBulto);
      const precioPorBulto: any = product.precioUnit * discount;
      price = Math.round(precioPorBulto);
    } else {
      price = product.precioUnit;
    }

    product.subtotal = product.quantity * price;
    this.getTotal();

    return product.subtotal;
  }

  getTotal() {
    this.total = 0;
    this.products.forEach(product => {
      this.total += product.subtotal;
    });
  }

  removeItem(product) {
    sweetAlert('Estas seguro que deseas eliminar este producto del carrito?', {
      buttons: ['Cancelar', 'Aceptar'],
      icon: 'warning'
    }).then( wantsToDelete => {
      if (wantsToDelete) {
        this.cartService.removeProductFromCart(product._id).subscribe( (res: any) => {
          sweetAlert(res.message, { icon: 'success' });
          this.getProducts();
        } );
      }
    } );
  }

  checkout() {
    this.cartService.checkOutMP(this.products).subscribe( (res: any) => {
      if (res.response && res.ok) {
        this.preference = res.response;
        showButton(this.preference.body.id);
      }
    } );
  }

}
