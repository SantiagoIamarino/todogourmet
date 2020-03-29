import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../configuration.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { UploadFileService } from '../../../../services/upload-file.service';
import { GobAPIService } from '../../../../services/gob-api.service';
import { ProductService } from '../../../../services/product.service';

import * as XLSX from 'xlsx';
import { Product } from '../../../../models/product.model';
import { ImportService } from '../../../../services/import.service';

declare var swal;

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  config: any;

  imageToChange = {
    id: '',
    file: null,
    link: ''
  };

  location = {
    provincia: '',
    localidad: ''
  };

  provincias: [];

  images = [];
  locations = [];

  products: Product[] = [];

  arrayBuffer: any;
  file: File;

  constructor(
    private configurationService: ConfigurationService,
    private loadingService: LoadingService,
    private uploadFileService: UploadFileService,
    public gobAPIService: GobAPIService,
    private productsService: ProductService,
    private importService: ImportService
  ) {
    this.getConfigs();
    this.getImages();
    this.getProvinces();
    this.getLocations();
   }

  ngOnInit() {
  }

  getConfigs() {
    this.loadingService.loading = true;

    this.configurationService.getConfigs().subscribe( (res: any) => {
      this.config = res.configs[0];
      this.loadingService.loading = false;
    });
  }

   configChange() {
     if (!this.config.shippingCost || !this.config.minValueToShipment) {
        swal('Error', 'No puedes dejar campos de la configuración vacios', 'error');
        return;
     }

     this.configurationService.updateConfig(this.config)
       .subscribe( (res: any) => {
        swal('Configuracion actualizada', res.message, 'success');
        this.getConfigs();
       });
  }


  getImages() {
    this.configurationService.getBannerImages().subscribe( images => {
      this.images = images;
    } );
  }

  getImage() {
    if (!this.imageToChange.id) {
      return;
    }

    this.configurationService.getImage(this.imageToChange.id).subscribe( (image: any) => {
      this.imageToChange.link = image.link;
    });
  }

  imgSelected( event ) {

    if (event.target.files.length > 0) {
      this.imageToChange.file = event.target.files[0];
    }
  }

  updateImage(image) {
    this.configurationService.updateBannerImage( image ).subscribe( (res) => {
      swal('Imagen actualizada', 'La imagen se ha subido correctemente', 'success');
    } );
  }

  uploadImages() {
    if ( this.imageToChange.file) {
      this.uploadFileService.uploadBannerImage( this.imageToChange )
      .then( () => {
        this.updateImage(this.imageToChange);
        this.imageToChange.id = '';
      } );
    } else {
      this.updateImage(this.imageToChange);
    }
  }

  downloadRegisters() {
    const fileName = 'TodoGourmet-productos.xlsx';

    swal({
      title: '¿Deseas descargar los registros en formato XLSX?',
      text: 'Si deseas continuar se descargaran automaticamente todos los registros',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then((download) => {
      if (download) {
        this.loadingService.loading = true;

        this.productsService.getAllProducts().then((res: any) => {
          this.products = res.products;

          this.loadingService.loading = false;

          setTimeout(() => {
            const element = document.getElementById('products-table');
            const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Productos');

            /* save to file */
            XLSX.writeFile(wb, fileName);
          }, 500);

        });
      }
    });
  }

  incomingfile(event) {
    this.file = event.target.files[0];
  }

  EditProducts() {
    this.importService.getDataFromExcelAndUpload(this.file, 'edit');
  }

  getProvinces() {
    return new Promise( (resolve, reject) => {
      this.gobAPIService.getProvinces().subscribe( (res: any) => {
        this.provincias = res.provincias;
        resolve();
      } );
    } );
  }

  getLocations() {
    this.configurationService.getLocations().subscribe( (res: any) => {
      this.locations = res.locations;
    } );
  }

  addLocation() {
    this.configurationService.addLocation(this.location).then( (message: string) => {
      swal({
        title: 'Localidad añadida',
        text: message,
        icon: 'success',
        timer: 2000
      });

      this.location = {
        provincia: '',
        localidad: ''
      };

      this.getLocations();
    } );
  }

  deleteLocation(location) {

    swal('Estas seguro que deseas eliminar este localidad?', {
        buttons: ['Cancelar', 'Aceptar'],
        icon: 'warning'
      }).then( wantsToDelete => {
        if (wantsToDelete) {
          this.configurationService.deleteLocation(location._id).subscribe( (res: any) => {
            swal({
              title: 'Localidad eliminada',
              text: res.message,
              icon: 'success',
              timer: 2000
            });

            this.getLocations();
          } );
        }
      } );
    }

}
