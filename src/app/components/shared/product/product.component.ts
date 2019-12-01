import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';
import { CartService } from '../../pages/cart/cart.service';
import { LoginService } from '../../../services/login/login.service';

declare var swal;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @Input() product: Product = new Product();

  certificaciones = [];

  imageLoaded = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private productService: ProductService,
    public loginService: LoginService
  ) { }

  ngOnInit() {
    if (this.product.certificaciones.length > 0) {
      this.productService.getCertifications(this.product.certificaciones)
      .then( (certifications: any) => {
        this.certificaciones = certifications;
      } );
    }
  }

  quantityChanges(moreOrLess: string, product) {

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
    } else {
      price = product.precioUnit;
    }
    if (product.quantity >= 5) {
      const discount: any = 1 - parseFloat('0.' + product.descuentoPorBulto);
      const precioPorBulto: any = price * discount;
      price = precioPorBulto;
    }

    product.total = (product.quantity * price).toFixed(1);
  }

  addToCart(product) {
    this.cartService.addProductToCart(product._id, product.quantity)
          .subscribe( (res: any) => {
            this.cartService.getProductsLength();

            swal(res.message, {
              buttons: ['Seguir comprando', 'Ir al carrito'],
              icon: 'success'
            }).then( goToCart => {
              if (goToCart) {
                this.router.navigate(['/carrito']);
              }
            } );
        } );
  }

}
