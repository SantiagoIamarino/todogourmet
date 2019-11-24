import { Component, OnInit } from '@angular/core';
import { TiendaService } from '../../../services/tienda.service';
import { LoadingService } from '../../shared/loading/loading.service';
import { Product } from '../../../models/product.model';
import { Filters } from '../../../models/filters.model';

declare function goToTop(animationTime);

declare function downloadObjectAsJson(exportObj, exportName);

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent implements OnInit {
  filters: any = new Filters();

  filtersToApply = {
    termino: '',
    marca: '',
    certificaciones: [],
    rubros: [],
    tipos: [],
    estaRefrigerado: false
  };

  products: Product[] = [];

  constructor(
    private tiendaService: TiendaService,
    public loadingService: LoadingService
    ) {
    this.loadingService.loading = true;

    this.tiendaService.getAllFilters().then( (filters: any) => {
      this.filters = this.tiendaService.filters;
      this.loadingService.loading = false;
      // downloadObjectAsJson(this.filters.marcas, 'Marcas');
    } );
  }

  ngOnInit() {
    goToTop(0);
    this.getPosts();
  }

  getPosts() {
    this.loadingService.loading = true;
    this.tiendaService.getProducts().subscribe( (products: any) => {
      this.products = products;
      this.loadingService.loading = false;
    } );
  }

  filterChanged(filterType, filterName) {
    if (filterType === 'rubro') {
      if (this.filtersToApply.rubros.indexOf(filterName) < 0) {
        this.filtersToApply.rubros.push(filterName);
      } else {
        const rubros =
          this.filtersToApply.rubros.filter((value) => {
            return value !== filterName;
          });
        this.filtersToApply.rubros = rubros;
      }
    }

    if (filterType === 'certificacion') {
      if (this.filtersToApply.certificaciones.indexOf(filterName) < 0) {
        this.filtersToApply.certificaciones.push(filterName);
      } else {
        const certificaciones =
          this.filtersToApply.certificaciones.filter((value) => {
            return value !== filterName;
          });
        this.filtersToApply.certificaciones = certificaciones;
      }
    }

    if (filterType === 'tipo') {
      if (this.filtersToApply.tipos.indexOf(filterName) < 0) {
        this.filtersToApply.tipos.push(filterName);
      } else {
        const tipos =
          this.filtersToApply.tipos.filter((value) => {
            return value !== filterName;
          });
        this.filtersToApply.tipos = tipos;
      }
    }
  }

  searchProducts() {

    if (this.filtersToApply.termino) {
      this.tiendaService.searchByQuery(this.filtersToApply.termino)
        .subscribe( (products: any) => {
          this.products = products;
        } );
    } else {
      this.getPosts();
    }
  }

  applyFilters() {
    this.tiendaService.searchByFilters(this.filtersToApply)
      .subscribe( products => {
        this.products = products;
      } );
  }
}
