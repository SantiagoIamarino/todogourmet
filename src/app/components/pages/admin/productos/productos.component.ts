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
  destacados = false;

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

  getDestacados(event) {
    this.destacados = !this.destacados;
    if (this.destacados) {
      this.productService.getDestacados().subscribe( products => {
        this.products = products;
      } );
    } else {
      this.getProducts();
    }
  }

  openEditModal( product ) {
    this.productToEdit = null;
    this.productToEdit = product;
    if (!this.productToEdit.gramaje.number) {
      this.productToEdit.gramaje = {
        number: this.productToEdit.gramaje.split(' ')[0],
        unity: this.productToEdit.gramaje.split(' ')[1].split('.')[0]
      }
    }
  }

  handleDestacado( product: Product ) {
    product.destacado = !product.destacado;

    this.productService.editProduct(product).then( (res) => {
      if (product.destacado) {
        sweetAlert({
          title: 'Producto actualizado!',
          text: 'Has destacado el producto correctamente!',
          icon: 'success',
          timer: 2000
        });
      } else {
        sweetAlert({
          title: 'Producto actualizado!',
          text: 'Has quitado el producto de destacados correctamente!',
          icon: 'success',
          timer: 2000
        });
      }

      this.getProducts();
    }  );
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
          this.getProducts();
        } );
      }
    } );
  }


}
