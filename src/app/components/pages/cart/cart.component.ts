import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from './cart.service';
import { LoadingService } from '../../shared/loading/loading.service';
import { LoginService } from '../../../services/login/login.service';
import { BACKEND_URL } from '../../../config/config';
import { ConfigurationService } from '../admin/configuration.service';
import { Router } from '@angular/router';
import { Product } from '../../../models/product.model';

declare function showButton(preferenceId);

declare function removeOldButton();

declare function goToTop(animationTime);

declare var swal;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {

  preference: any;

  products: any[] = [];

  subtotals = [];
  total = 0;
  subtotal = 0;
  discounts = 0;
  isPayingShipping = false;

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
    goToTop(0);
    this.cartService.isOnCart.emit(false);
  }

  ngOnDestroy() {
    this.cartService.isOnCart.emit(true);
    this.products.forEach(product => {
      const subscriber =
        this.cartService.updateCartProduct(product).subscribe( res => {
          subscriber.unsubscribe();
        } );
    });
  }

  getProducts() {
    this.loadingService.loading = true;
    this.cartService.getProducts().subscribe( (res: any) => {
      this.products = res.products;
      this.verifyProducts(this.products);
      this.loadingService.loading = false;
    } );
  }

  verifyProducts(products: Product[]) {
    products.forEach((product: any) => {
      if (!product.productId) {
        this.removeProductFromCart(product);
      }
    });
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

    let priceWithoutDisc = 0;
    let discount = 0;
    let price = 0;
    if (this.loginService.user && this.loginService.user.role === 'COMMERCE_ROLE') {
      priceWithoutDisc = product.productId.precioComercio;
    } else {
      priceWithoutDisc = product.productId.precioUnit;
    }

    if (product.quantity >= product.productId.unidadPorBulto) {
      // tslint:disable: no-var-keyword
      // tslint:disable-next-line: prefer-const
      if (product.productId.descuentoPorBulto >= 10) {
        discount = 1 - parseFloat('0.' + product.productId.descuentoPorBulto);
      } else {
        discount = 1 - parseFloat('0.0' + product.productId.descuentoPorBulto);
      }
      const precioPorBulto: any = priceWithoutDisc * discount;
      price = precioPorBulto;
    } else {
      price = priceWithoutDisc;
    }

    product.subtotal = (product.quantity * price).toFixed(2);
    product.totalWithoutDisc = (priceWithoutDisc * product.quantity).toFixed(2);
    product.discount =  (discount > 0) ? parseFloat(product.totalWithoutDisc) - (parseFloat(product.totalWithoutDisc) * discount) : 0;
    product.discount = (product.discount > 0) ? product.discount.toFixed(2) : 0;
    this.getTotals();

    return product.subtotal;
  }

  getTotals() {
    this.subtotal = 0;
    this.total = 0;
    this.discounts = 0;
    this.products.forEach(product => {
      this.subtotal += parseFloat(product.totalWithoutDisc);
      this.total += parseFloat(product.subtotal);
      this.discounts += parseFloat(product.discount);
    });

    if (this.loginService.user.localidad.id === '06357110003' && this.config) {
      if (this.total < this.config.minValueToShipment) {
        this.isPayingShipping = true;
        this.total = this.total + parseInt(this.config.shippingCost);
      } else {
        this.isPayingShipping = false;
        this.total = this.total;
      }
    } else {
      this.total = this.total;
    }

    this.subtotal = parseFloat(this.subtotal.toFixed(2));
    this.total = parseFloat(this.total.toFixed(2));
    this.discounts = parseFloat(this.discounts.toFixed(2));
  }

  removeItem(product) {
    sweetAlert('Estas seguro que deseas eliminar este producto del carrito?', {
      buttons: ['Cancelar', 'Aceptar'],
      icon: 'warning'
    }).then( wantsToDelete => {
      if (wantsToDelete) {
        this.removeProductFromCart(product).then((res: any) => {
          sweetAlert({text: res.message,  icon: 'success', timer: 2000 });
        });
      }
    } );
  }

  removeProductFromCart(product) {
    return new Promise((resolve, reject) => {
      this.cartService.removeProductFromCart(product._id).subscribe( (res: any) => {
        this.getProducts();
        this.cartService.getProductsLength();

        resolve(res);
    } );
    });
  }

  payment(type: string) {

    const body = {
      user: this.loginService.user._id,
      date: new Date(),
      products: [],
      paymentMethod: type,
      subtotal: this.subtotal,
      discount: this.discounts,
      total : this.total,
      shipping: (this.isPayingShipping) ? '$' + this.config.shippingCost : 'Gratuito',
    };


    this.products.forEach(product => {
      const productToSend = {
        id: product.productId._id,
        name: product.productId.name,
        gramaje: product.productId.gramaje,
        marca: product.productId.marca.nombre,
        unidad: ( this.loginService.user.role === 'COMMERCE_ROLE' ) ? product.productId.precioComercio : product.productId.precioUnit,
        quantity: product.quantity,
        subtotal: product.subtotal,
        totalWithoutDisc: product.totalWithoutDisc,
        discountPercentage: product.productId.descuentoPorBulto,
        discount: product.discount,
        barCode: (product.productId.barCode) ? product.productId.barCode : ''
      };

      body.products.push(productToSend);
    });

    this.cartService.payment(body).subscribe( (res: any) => {
        swal({
          title: 'Pedido realizado correctamente',
          text: 'Nos contactaremos a la brevedad para coordinar la entrega!',
          icon: 'success'
        }).then( () => {
          this.router.navigate(['/tienda']);
        } );

        this.cartService.removeAllProducts().subscribe( () => {
          this.cartService.getProductsLength();
        } );
        this.loginService.saveInStorage(res.userDB, this.loginService.token);
    } );
  }

  checkout() {
    if (this.loginService.user.role !== 'COMMERCE_ROLE') {
      removeOldButton();
      this.cartService.checkOutMP(this.products, this.config, this.subtotal)
      .subscribe( (res: any) => {
        if (res.response && res.ok) {
          this.preference = res.response;
          showButton(this.preference.body.id);
        }
      } );
    } else {
      this.payment('efectivo');
    }
  }

}
