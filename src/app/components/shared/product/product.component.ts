import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';
import { CartService } from '../../pages/cart/cart.service';
import { LoginService } from '../../../services/login/login.service';
import { UsersService } from '../../pages/admin/users.service';
import { TiendaService } from '../../../services/tienda.service';

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
    public loginService: LoginService,
    private usersService: UsersService,
    private tiendaService: TiendaService
  ) { }

  ngOnInit() {
    if (this.product.certificaciones.length > 0) {
      this.productService.getCertifications(this.product.certificaciones)
      .then( (certifications: any) => {
        this.certificaciones = certifications;
      } );
    }
  }

  showProductInfoModal() {
    this.productService.showProductInfoModal.emit(this.product);
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

    if (product.quantity >= product.unidadPorBulto) {
      let discount = 0;
      if (product.descuentoPorBulto >= 10) {
        discount = 1 - parseFloat('0.' + product.descuentoPorBulto);
      } else {
        discount = 1 - parseFloat('0.0' + product.descuentoPorBulto);
      }
      const precioPorBulto: any = price * discount;
      price = precioPorBulto;
    }

    product.total = (product.quantity * price).toFixed(1);
  }

  handleFavourite(product) {

    const productIdIndex = this.loginService.user.surtido.indexOf(product._id);

    let message = '';

    if (productIdIndex >= 0) {
      message = 'Has quitado este producto correctamente de tu surtido';
      this.loginService.user.surtido.splice(productIdIndex, 1);
    } else {
      message = 'Has agregado este producto correctamente a tu surtido';
      this.loginService.user.surtido.push(product._id);
    }

    this.usersService.updateUser(this.loginService.user).subscribe( (res) => {
      swal({
        title: 'Surtido actualizado!',
        text: message,
        icon: 'success',
        timer: 2000
      });
      this.loginService.saveInStorage(this.loginService.user, this.loginService.token);
    } );
  }

  addToCart(product: Product) {
    this.cartService.addProductToCart(product._id, product.quantity, product.estaRefrigerado)
          .then( (res: any) => {
            this.cartService.getProductsLength();

            swal(res.message, {
              buttons: ['Seguir comprando', 'Ir al carrito'],
              icon: 'success'
            }).then( goToCart => {
              if (goToCart) {
                this.router.navigate(['/carrito']);
              }
            } );
        } )
        .catch( (err) => {
          swal({
            title: 'Error al agregar al carrito',
            text: err,
            icon: 'error',
            timer: 2500
          });
          this.tiendaService.notAllowedSubscriber.emit('Shipping not allowed');
        } );
  }

}
