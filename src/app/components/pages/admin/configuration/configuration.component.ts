import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../configuration.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { UploadFileService } from '../../../../services/upload-file.service';
import { GobAPIService } from '../../../../services/gob-api.service';


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

  constructor(
    private configurationService: ConfigurationService,
    private loadingService: LoadingService,
    private uploadFileService: UploadFileService,
    public gobAPIService: GobAPIService
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
