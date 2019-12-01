import { Component, OnInit } from '@angular/core';
import { SurtidoService } from 'src/app/services/surtido.service';
import { LoadingService } from '../../shared/loading/loading.service';
import { Product } from 'src/app/models/product.model';
import { LoginService } from '../../../services/login/login.service';
import { CartService } from '../cart/cart.service';
import { Router } from '@angular/router';

declare var swal;

@Component({
  selector: 'app-surtido',
  templateUrl: './surtido.component.html',
  styleUrls: ['./surtido.component.css']
})
export class SurtidoComponent implements OnInit {

  surtido: Product[] = [];

  constructor(
    private surtidoService: SurtidoService,
    public loginService: LoginService,
    private loadingService: LoadingService,
    private cartService: CartService,
    private router: Router
  ) {
    this.getSurtido();
   }

  ngOnInit() {
  }

  getSurtido() {
    this.loadingService.loading = true;

    this.surtidoService.getSurtido().subscribe( (res: any) => {
      this.surtido = res.surtido;
      this.loadingService.loading = false;
    } );
  }

  addToCart(product: Product) {
    this.cartService.addProductToCart(product._id, 1)
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

}
