import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../../../services/login/login.service';
import { ConfigurationService } from '../admin/configuration.service';
import { LoadingService } from '../../shared/loading/loading.service';

declare function goToTop(animationTime);

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  locations = [];
  config: any;

  constructor(
    public loginService: LoginService,
    private configurationService: ConfigurationService,
    private loadingService: LoadingService
  ) {
    this.configurationService.getLocations().subscribe( (res: any) => {
      this.locations = res.locations;
    } );

    this.configurationService.getConfigs().subscribe( (res: any) => {
      this.config = res.configs[0];
      this.loadingService.loading = false;
    } );
   }

  ngOnInit() {
    goToTop(0);
  }

}
