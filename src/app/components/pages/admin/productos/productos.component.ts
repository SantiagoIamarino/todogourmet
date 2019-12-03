import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/product.service';
import { Product } from '../../../../models/product.model';
import { LoadingService } from '../../../shared/loading/loading.service';
import { TiendaService } from '../../../../services/tienda.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  products: Product[] = [];
  marcas: any[] = [];

  loading = false;

  lastKeyPressed;

  productToEdit: Product;

  filter = '';

  constructor(
    private productService: ProductService,
    private loadingService: LoadingService,
    private tiendaService: TiendaService
  ) {
    this.getProducts();
    this.productService.productsUpdated.subscribe( () => {
      this.getProducts();
    } );
    this.getMarcas();
   }

  ngOnInit() {
  }

  getProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe( (products: any) => {
      this.products = products;
      this.loading = false;
      this.loadingService.loading = false;
    } );
  }

  getMarcas() {
    this.tiendaService.getFilter('marcas').then( (marcas: any) => {
      this.marcas = marcas;
    } );
  }

  searchProducts( term: string, event ) {
    if (term) {
      this.loading = true;

      this.productService.searchProducts(term).subscribe( (res: any) => {
          this.products = res.products;
          this.loading = false;
      } );

    } else {
      this.getProducts();
    }
  }

  applyFilter() {
    if (!this.filter) {
      this.getProducts();
      return;
    }

    this.productService.getProductsByFilter(this.filter).subscribe( (res: any) => {
      this.products = res.products;
    } );
  }

  openEditModal( product ) {
    this.productToEdit = null;
    this.productToEdit = product;
  }

  deleteProduct( product: Product ) {

    sweetAlert('Estas seguro que deseas eliminar este producto?', {
      buttons: ['Cancelar', 'Aceptar'],
      icon: 'warning'
    }).then( wantsToDelete => {
      if (wantsToDelete) {
        this.productService.deleteProduct( product ).subscribe( () => {
          sweetAlert(
            'Producto eliminado',
            'El producto se ha eliminado correctamente',
            'success'
          );
        } );
        window.location.reload();
      }
    } );
  }


}
