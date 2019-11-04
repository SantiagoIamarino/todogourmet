import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductService } from '../../../../services/product.service';
import { UploadFileService } from '../../../../services/upload-file.service';

import sweetAlert from 'sweetalert';
import { TiendaService } from '../../../../services/tienda.service';

declare function closeEditModal( modalId );

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['../product.component.css',
              './edit-product.component.css']
})
export class EditProductComponent implements OnChanges {

  @Input() product: Product = new Product();

  loading = true;
  filters = {
    marcas: [],
    certificaciones: [],
    rubros: [],
    tipos: []
  };

  imgToUpload: any;
  tempImg: any;
  uploadProgress = null;

  constructor(
    private productService: ProductService,
    private uploadFileService: UploadFileService,
    private tiendaService: TiendaService
  ) {
    this.tiendaService.getAllFilters().then( (filters: any) => {
      this.filters = this.tiendaService.filters;
      this.loading = false;
    } ).catch( err => {
      this.filters.marcas = [];
    } );
   }

  ngOnChanges(changes: SimpleChanges): void {
    this.tempImg = null;
    this.imgToUpload = null; // Restarting vars when modal info changes
    this.uploadProgress = null;
  }

  imgSelected( event ) {

    if (event.target.files.length > 0) {
      this.imgToUpload = event.target.files[0];

      const reader = new FileReader();
      const urlImgTemp = reader.readAsDataURL( this.imgToUpload );

      reader.onloadend = () => {
        this.tempImg = reader.result;
      };
    }
  }

  filterChanged(filterType, filterName) {
    if (filterType === 'rubro') {
      if (this.product.rubros.indexOf(filterName) < 0) {
        this.product.rubros.push(filterName);
      } else {
        const rubros =
          this.product.rubros.filter((value) => {
            return value !== filterName;
          });
        this.product.rubros = rubros;
      }
    }

    if (filterType === 'certificacion') {
      if (this.product.certificaciones.indexOf(filterName) < 0) {
        this.product.certificaciones.push(filterName);
      } else {
        const certificaciones =
          this.product.certificaciones.filter((value) => {
            return value !== filterName;
          });
        this.product.certificaciones = certificaciones;
      }
    }

    if (filterType === 'tipo') {
      if (this.product.tipos.indexOf(filterName) < 0) {
        this.product.tipos.push(filterName);
      } else {
        const tipos =
          this.product.tipos.filter((value) => {
            return value !== filterName;
          });
        this.product.tipos = tipos;
      }
    }
  }

  uploadImages(){
    return new Promise( (resolve, reject) => {
      this.uploadProgress = 'loading';

      this.uploadFileService.uploadImage( this.imgToUpload, 'products' ).subscribe( percentage => {

        this.uploadFileService.downloadUrl.subscribe( url => {
          if (url && !this.product.img && this.product.validators.isValid) {
            this.product.img = url; // Getting download URL
            resolve('images uploaded');
          }
        } );

      } );
    } );
  }

  closeEditModal() {
    closeEditModal( 'editModal' );
    console.log(this.product);
  }

  editProduct() {
    if (!this.imgToUpload  && !this.product.img) {
      sweetAlert('Error', 'Debes agregar una imagen', 'error');
      return;
    }

    let product: Product = new Product();

    product = this.product;

    const validation = product.validateProduct();

    // if (!validation.isValid) {
    //   sweetAlert('Error', validation.errors, 'error');
    //   return;
    // }

    // this.uploadImages().then( () => {
    //   this.productService.editProduct(this.product);

    //   this.productService.productUpdated.subscribe( () => {
    //     sweetAlert(
    //       'Producto editado',
    //       'El producto se ha editado correctamente',
    //       'success'
    //     );

    //     closeEditModal('uploadProduct');
    //     this.product = new Product();
    //     this.uploadProgress = null;
    //     this.tempImg = null;
    //   } );
    // } );
  }

  uploadProduct() {
    if (!this.imgToUpload) {
      sweetAlert('Error', 'Debes agregar una imagen', 'error');
      return;
    }

    const validation = this.product.validateProduct();

    if (!validation.isValid) {
      sweetAlert('Error', validation.errors, 'error');
      return;
    }

    this.uploadImages().then( () => {
      this.productService.uploadProduct(this.product).then( res => {

        sweetAlert(
          'Producto subido',
          'El producto se ha subido correctamente',
          'success'
        );

        closeEditModal('uploadProduct');
        this.product = new Product();
        this.uploadProgress = null;
        this.tempImg = null;
      } );
    } );
  }

}
