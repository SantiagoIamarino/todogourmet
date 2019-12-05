import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../shared/loading/loading.service';
import { Product } from '../../../models/product.model';
import { Filters } from '../../../models/filters.model';
import { LoginService } from '../../../services/login/login.service';
import { ActivatedRoute } from '@angular/router';
import { SurtidoService } from 'src/app/services/surtido.service';

declare function goToTop(animationTime);

declare function showLoginModal();

declare var swal;

@Component({
  selector: 'app-surtido',
  templateUrl: './surtido.component.html',
  styleUrls: ['../tienda/tienda.component.css', './surtido.component.css']
})
export class SurtidoComponent implements OnInit {
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
    private surtidoService: SurtidoService,
    public loginService: LoginService,
    public loadingService: LoadingService,
    private route: ActivatedRoute
    ) {
    this.loadingService.loading = true;

    this.surtidoService.getAllFilters().then( (filters: any) => {
      this.filters = this.surtidoService.filters;
      this.loadingService.loading = false;
    } );

    this.route.paramMap.subscribe( params => {
      this.applyParamsFilter(
        params.get('filterType'),
        params.get('filterValue')
      );
    } );
  }

  ngOnInit() {
    goToTop(0);
    this.getPosts();
  }

  getPosts() {
    this.loadingService.loading = true;
    this.surtidoService.getProducts().subscribe( (products: any) => {
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

    this.applyFilters();
  }

  applyParamsFilter(filterType: string, filterValue: any) {
    console.log('entro');
    if (filterType && filterValue) {
      if (filterType === 'refrigerado') {
        this.filtersToApply.estaRefrigerado = true;
        this.applyFilters(true);
      } else if (filterType !== 'marca') {
        this.filterChanged(filterType, filterValue);
      } else {
        this.filtersToApply.marca = filterValue;
        this.applyFilters();
      }
    }
  }

  resetFilters() {
    this.filtersToApply = {
      termino: '',
      marca: '',
      certificaciones: [],
      rubros: [],
      tipos: [],
      estaRefrigerado: false
    };

    this.applyFilters();
  }

  searchProducts() {

    if (this.filtersToApply.termino) {
      this.surtidoService.searchByQuery(this.filtersToApply.termino)
        .subscribe( (products: any) => {
          this.products = products;
        } );
    } else {
      this.getPosts();
    }
  }

  applyFilters(applyRefrigerado = false) {

    if (!applyRefrigerado) {
      this.surtidoService.searchByFilters(this.filtersToApply, true)
      .subscribe( products => {
        this.products = products;
      } );
      return;
    }

    this.surtidoService.searchByFilters(this.filtersToApply)
      .subscribe( products => {
        this.products = products;
      } );
  }
}
