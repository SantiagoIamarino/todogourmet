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

  addToCart(productId: string) {

    swal(
      '¿Deseas añadir este producto al carrito?',
      'Ofrecemos opciones de compra por bulto o unidad, ¿Cual deseas?',
      'warning', {
      buttons: {
        cancel: 'Cancelar',
        catch: {
          text: 'Por bulto',
          value: 'bulto'
        },
        defeat: {
          text: 'Por unidad',
          value: 'unidad'
        },
      },
    }).then( metodo => {
      if (metodo) {
        this.cartService.addProductToCart(productId, metodo)
          .subscribe( (res: any) => {
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
    } );
  }

}
