import { Component, OnInit } from '@angular/core';
import { TiendaService } from '../../../services/tienda.service';
import { LoadingService } from '../../shared/loading/loading.service';
import { Product } from '../../../models/product.model';
import { Filters } from '../../../models/filters.model';
import { LoginService } from '../../../services/login/login.service';
import { ActivatedRoute } from '@angular/router';
import { PRODUCTS_PER_PAGE } from '../../../config/config';

declare function goToTop(animationTime);

declare function showLoginModal();

declare var swal;

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

  searchType = null;

  pages = [];
  currentPage = 1;
  queryPage = 1;
  filtersPage = 1;

  constructor(
    private tiendaService: TiendaService,
    public loginService: LoginService,
    public loadingService: LoadingService,
    private route: ActivatedRoute
    ) {
    this.loadingService.loading = true;

    this.tiendaService.getAllFilters().then( (filters: any) => {
      this.filters = this.tiendaService.filters;
      this.loadingService.loading = false;
    } );

    this.route.paramMap.subscribe( params => {
      this.applyParamsFilter(
        params.get('filterType'),
        params.get('filterValue')
      );
    } );

    this.tiendaService.notAllowedSubscriber.subscribe( () => {
        this.filtersToApply.estaRefrigerado = false;
        this.applyFilters(true);
    } );
  }

  ngOnInit() {
    goToTop(0);
    if (!this.loginService.user || !this.loginService.token) {
      swal(
      'Atención',
      'Debes iniciar sesión para poder ver los precios y realizar la compra de productos!',
      {
        buttons: ['Seguir en la tienda', 'Iniciar sesion'],
        icon: 'error'
      }).then( goToCart => {
        if (goToCart) {
          showLoginModal();
        }
      } );
    }
    this.getPosts();
  }

  getPosts() {
    this.loadingService.loading = true;
    this.searchType = null;

    this.tiendaService.getProducts(this.currentPage).subscribe( (res: any) => {
      this.products = res.products;

      this.getPagesQuantity(res);
      goToTop(0);

      this.loadingService.loading = false;
    } );
  }

  getPagesQuantity(res: any) {
    this.pages = [];
    const pages = Math.ceil(res.productsLength / PRODUCTS_PER_PAGE);

    for (let i = 0; i < pages ; i++) {
      this.pages.push(i + 1);
    }
  }

  switchPage(actionOrPage: any) {
    if (actionOrPage === 'prev') {
      if (this.searchType === 'query') {
        this.queryPage -= 1;
      } else if (this.searchType === 'filters') {
        this.filtersPage -= 1;
      } else {
        this.currentPage -= 1;
      }
    } else if (actionOrPage === 'next') {
      if (this.searchType === 'query') {
        this.queryPage += 1;
      } else if (this.searchType === 'filters') {
        this.filtersPage += 1;
      } else {
        this.currentPage += 1;
      }
    } else {
      if (this.searchType === 'query') {
        this.queryPage = actionOrPage;
      } else if (this.searchType === 'filters') {
        this.filtersPage = actionOrPage;
      } else {
        this.currentPage = actionOrPage;
      }
    }

    if (this.searchType === 'query') {
      this.searchProducts();
    } else if (this.searchType === 'filters') {
      this.applyFilters();
    } else {
      this.getPosts();
    }
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
    this.loadingService.loading = true;

    if (this.filtersToApply.termino) {
      this.tiendaService.searchByQuery(this.filtersToApply.termino, this.queryPage)
        .subscribe( (res: any) => {
          this.products = res.products;
          this.loadingService.loading = false;

          this.getPagesQuantity(res);
          this.searchType = 'query';
          goToTop(0);
        } );
    } else {
      this.getPosts();
    }
  }

  applyFilters(applyRefrigerado = false) {

    this.loadingService.loading = true;

    if (!applyRefrigerado) {
      this.tiendaService.searchByFilters(this.filtersToApply, true, this.filtersPage)
      .subscribe( (res: any) => {
        this.products = res.products;
        this.loadingService.loading = false;

        this.getPagesQuantity(res);
        this.searchType = 'filters';
        goToTop(0);
      } );
      return;
    }

    this.tiendaService.searchByFilters(this.filtersToApply, false, this.filtersPage)
      .subscribe( (res: any) => {
        this.products = res.products;
        this.loadingService.loading = false;

        this.getPagesQuantity(res);
        this.searchType = 'filters';
        goToTop(0);
      } );
  }
}
