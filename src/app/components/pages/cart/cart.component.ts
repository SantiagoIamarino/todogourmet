import { Component, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { LoadingService } from '../../shared/loading/loading.service';
import { LoginService } from '../../../services/login/login.service';
import { Product } from '../../../models/product.model';

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

  constructor(
    private cartService: CartService,
    public loginService: LoginService,
    private loadingService: LoadingService
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

  getSubtotal(product) {
    if (this.loginService.user._id && this.loginService.user.role === 'COMMERCE_ROLE') {
      product.subtotal = product.productId.precioComercio * product.quantity;
      this.getTotal();
      return product.productId.precioComercio * product.quantity;
    } else {
      product.subtotal = product.productId.precioUnit * product.quantity;
      this.getTotal();
      return product.productId.precioUnit * product.quantity;
    }
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
    console.log(this.subtotals);
    // this.cartService.checkOutMP().subscribe( (res: any) => {
    //   if (res.response && res.ok) {
    //     this.preference = res.response;
    //     console.log(this.preference);
    //   }
    // } );
  }

}
