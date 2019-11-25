import { Component, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { LoadingService } from '../../shared/loading/loading.service';
import { LoginService } from '../../../services/login/login.service';
import { BACKEND_URL } from '../../../config/config';
import { ConfigurationService } from '../admin/configuration.service';
import { Router } from '@angular/router';

declare function showButton(preferenceId);

declare function removeOldButton();

declare var swal;

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
  subtotal = 0;

  postUrl = BACKEND_URL + '/checkout/finished';

  config: any;

  constructor(
    private cartService: CartService,
    public loginService: LoginService,
    private configurationService: ConfigurationService,
    public loadingService: LoadingService,
    private router: Router
  ) {
    this.getProducts();
    this.getConfigs();
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

  getConfigs() {
    this.configurationService.getConfigs().subscribe( (res: any) => {
      this.config = res.configs[0];
    } );
  }

  getSubtotal(moreOrLess: string, product) {

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
      price = product.productId.precioComercio;
    } else if (product.quantity >= 5) {
      const discount: any = 1 - parseFloat('0.' + product.productId.descuentoPorBulto);
      const precioPorBulto: any = product.productId.precioUnit * discount;
      price = Math.round(precioPorBulto);
    } else {
      price = product.productId.precioUnit;
    }

    product.subtotal = product.quantity * price;
    this.getTotals();

    return product.subtotal;
  }

  getTotals() {
    this.subtotal = 0;
    this.total = 0;
    this.products.forEach(product => {
      this.subtotal += product.subtotal;
    });

    if (this.loginService.user.isMardel && this.config) {
      if (this.subtotal < this.config.minValueToShipment) {
        this.total = this.subtotal + parseInt(this.config.shippingCost);
      } else {
        this.total = this.subtotal;
      }
    } else {
      this.total = this.subtotal;
    }
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
          this.cartService.getProductsLength();
        } );
      }
    } );
  }

  payment(type: string) {

    const body = {
      user: this.loginService.user._id,
      products: [],
      paymentMethod: type,
      total : this.total
    };

    this.products.forEach(product => {
      body.products.push(product.productId._id);
    });

    this.cartService.payment(body).subscribe( (res: any) => {
        swal(
          'Pedido realizado correctamente',
          'Nos contactaremos a la brevedad para coordinar la compra!',
          'success'
        ).then( () => {
          this.router.navigate(['/tienda']);
        } );

        this.cartService.removeAllProducts().subscribe( () => {
          this.cartService.getProductsLength();
        } );
    } );
  }

  checkout() {
    removeOldButton();
    this.cartService.checkOutMP(this.products, this.config, this.subtotal)
    .subscribe( (res: any) => {
      if (res.response && res.ok) {
        this.preference = res.response;
        showButton(this.preference.body.id);
      }
    } );
  }

}
