import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../configuration.service';
import { LoadingService } from '../../../shared/loading/loading.service';


declare var swal;

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  config: any;

  constructor(
    private configurationService: ConfigurationService,
    private loadingService: LoadingService
  ) {
    this.getConfigs();
   }

   getConfigs() {
     this.loadingService.loading = true;

     this.configurationService.getConfigs().subscribe( (res: any) => {
       this.config = res.configs[0];
       console.log(this.config);
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

  ngOnInit() {
  }

}
