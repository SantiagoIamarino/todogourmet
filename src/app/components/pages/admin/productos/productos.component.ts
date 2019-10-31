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
   }

  ngOnInit() {
  }

  getProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe( (products: any) => {
      this.products = products;
      this.loading = false;
    } );
  }

  searchProducts( term: string, event ) {
    if (term) {
      this.loading = true;

      this.productService.searchProducts(term).subscribe( (results: any) => {
          this.products = results;
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

  deleteProduct( productId: string ) {
    this.productService.deleteProduct(productId);
  }

}
