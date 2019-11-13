import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../../models/product.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';
import sweetAlert from 'sweetalert';

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
    private afs: AngularFirestore,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit() {
    if (this.product.certificaciones.length > 0) {
      this.productService.getCertifications(this.product.certificaciones)
      .then( (certifications: any) => {
        this.certificaciones = certifications;
      } );
    }
  }

  addToCart() {

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
        swal('Producto agregado al carrito', {
          buttons: ['Seguir comprando', 'Ir al carrito'],
          icon: 'success'
        }).then( goToCart => {
          if (goToCart) {
            this.router.navigate(['/carrito']);
          }
        } );
      }
    } );
  }

}
