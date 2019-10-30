import { Component, OnInit } from '@angular/core';
import { TiendaService } from '../../../services/tienda.service';
import { LoadingService } from '../../shared/loading/loading.service';

declare function goToTop(animationTime);

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent implements OnInit {
  filters = {
    marcas: [],
    certificaciones: [],
    rubros: [],
    tipos: []
  };

  constructor(
    private tiendaService: TiendaService,
    public loadingService: LoadingService
    ) {
    this.loadingService.loading = true;

    this.tiendaService.getAllFilters().then( (filters: any) => {
      this.filters = this.tiendaService.filters;
      this.loadingService.loading = false;
    } );

  }

  ngOnInit() {
    goToTop(0);
  }
}
