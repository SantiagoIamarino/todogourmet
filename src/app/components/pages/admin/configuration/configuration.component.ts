import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../configuration.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { UploadFileService } from '../../../../services/upload-file.service';


declare var swal;

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  config: any;

  message: string;
  imageToChange = {
    id: '',
    file: null
  };

  images = [];

  constructor(
    private configurationService: ConfigurationService,
    private loadingService: LoadingService,
    private uploadFileService: UploadFileService
  ) {
    this.getConfigs();
    this.getImages();
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

  sendMessage() {
    this.configurationService.sendMessage(this.message).subscribe( (res: any) => {
      swal('Mensaje enviado', res.message, 'success');
      this.message = '';
    } );
  }

  getImages() {
    this.configurationService.getBannerImages().subscribe( images => {
      this.images = images;
    } );
  }

  imgSelected( event ) {

    if (event.target.files.length > 0) {
      this.imageToChange.file = event.target.files[0];
    }
  }

  uploadImages() {
    if ( !this.imageToChange.file) {
      swal('Error', 'Debes seleccionar una imagen', 'error');
      return;
    }

    this.uploadFileService.uploadBannerImage( this.imageToChange )
      .then( () => {
        swal('Imagen actualizada', 'La imagen se ha subido correctemente', 'success');
        this.imageToChange.id = '';
    } );
  }

  ngOnInit() {
  }

}
