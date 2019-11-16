import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/product.service';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  products: Product[] = [];

  loading = false;

  lastKeyPressed;

  productToEdit: Product;

  constructor(
    private productService: ProductService
  ) {
    this.getProducts();
    this.productService.productsUpdated.subscribe( () => {
      this.getProducts();
    } );
   }

  ngOnInit() {
  }

  getProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe( (products: any) => {
      this.products = products;
      console.log(products);
      this.loading = false;
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
