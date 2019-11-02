import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductService } from '../../../../services/product.service';
import { UploadFileService } from '../../../../services/upload-file.service';

import sweetAlert from 'sweetalert';
import { TiendaService } from '../../../../services/tienda.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['../product.component.css',
              './edit-product.component.css']
})
export class EditProductComponent implements OnChanges {

  @Input() product: Product = new Product();

  imgToUpload: any;

  tempImg: any;

  uploadProgress = null;

  filters = {
    marcas: []
  };

  constructor(
    private productService: ProductService,
    private uploadFileService: UploadFileService,
    private tiendaService: TiendaService
  ) {
    this.tiendaService.getAllFilters().then( (filters: any) => {
      this.filters = this.tiendaService.filters;
      console.log(this.filters);
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

  editProduct() {
    if (!this.imgToUpload  && !this.product.img) {
      sweetAlert('Error', 'Debes agregar una imagen', 'error');
      return;
    }

    const validation = this.product.validateProduct();

    if (!validation.isValid) {
      sweetAlert('Error', validation.errors, 'error');
      return;
    }

    this.uploadProgress = 'loading';
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

    this.uploadProgress = 'loading';

    this.uploadFileService.uploadImage( this.imgToUpload, 'products' ).subscribe( percentage => {

      this.uploadFileService.downloadUrl.subscribe( url => {
        if (url && !this.product.img && this.product.validators.isValid) {
          this.product.img = url; // Getting download URL
          this.productService.uploadProduct(this.product).then( res => {

            sweetAlert(
              'Producto subido',
              'El producto se ha subido correctamente',
              'success'
            );

            this.product = new Product();

            this.uploadProgress = null;

            this.tempImg = null;

          } );
        }
      } );

    } );
  }

}
