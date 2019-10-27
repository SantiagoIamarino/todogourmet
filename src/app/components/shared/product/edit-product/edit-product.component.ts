import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductService } from '../../../../services/product.service';
import { UploadFileService } from '../../../../services/upload-file.service';

import sweetAlert from 'sweetalert';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['../product.component.css',
              './edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  product: Product =  new Product();

  imgToUpload: any;

  tempImg: any;

  uploadProgress = null;

  constructor(
    private productService: ProductService,
    private uploadFileService: UploadFileService,
  ) {
   }

  ngOnInit() {
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

    this.uploadFileService.uploadImage( this.imgToUpload ).subscribe( percentage => {

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
