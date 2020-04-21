import { Component, OnInit } from '@angular/core';
import { TiendaService } from '../../../services/tienda.service';
import { LoadingService } from '../../shared/loading/loading.service';
import { Product } from '../../../models/product.model';
import { Filters } from '../../../models/filters.model';
import { LoginService } from '../../../services/login/login.service';
import { ActivatedRoute } from '@angular/router';
import { PRODUCTS_PER_PAGE } from '../../../config/config';
import { ProductService } from '../../../services/product.service';

declare function goToTop(animationTime);

declare function showLoginModal();

declare function showProductInfoModal();

declare function handleOptions(filterClass);

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
    estaRefrigerado: null,
    conStock: null
  };

  products: Product[] = [];
  productsCount = 0;

  searchType = null;

  pages = [];
  currentPage = 1;
  queryPage = 1;
  filtersPage = 1;

  productToShowMoreInfo: Product;

  isSearching = false;

  constructor(
    private tiendaService: TiendaService,
    public loginService: LoginService,
    private productService: ProductService,
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

    this.productService.showProductInfoModal.subscribe( (product: Product) => {
      this.productToShowMoreInfo = product;
      showProductInfoModal();
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

  getPosts(resetPages = true) {
    if (resetPages) {
      this.currentPage = 1;
    }

    this.searchType = null;

    this.tiendaService.getProducts(this.currentPage).subscribe( (res: any) => {
      this.products = res.products;
      this.productsCount = res.productsLength;

      this.getPagesQuantity(res);
      goToTop(0);
    } );
  }

  getPagesQuantity(res: any) {
    this.pages = [];
    const pages = Math.ceil(res.productsLength / PRODUCTS_PER_PAGE);

    for (let i = 0; i < pages ; i++) {
      this.pages.push(i + 1);
    }
  }

  handleOptions(filterClass: string){
    handleOptions(filterClass);
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
      this.searchProducts(false);
    } else if (this.searchType === 'filters') {
      this.applyFilters(true, false);
    } else {
      this.getPosts(false);
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
      estaRefrigerado: null
    };

    this.getPosts();
  }

  searchProducts(resetPages = true) {

    if (resetPages) {
      this.queryPage = 1;
    }

    this.applyFilters();
  }

  applyFilters(applyRefrigerado = false, resetPages = true) {

    if (resetPages) {
      this.filtersPage = 1;
    }

    if (this.isSearching) {
      this.applyFilters();
    }

    if (!applyRefrigerado || this.filtersToApply.estaRefrigerado === null) {
      this.tiendaService.searchByFilters(this.filtersToApply, true, this.filtersPage)
      .subscribe( (res: any) => {
        this.products = res.products;
        this.productsCount = res.productsLength;

        this.getPagesQuantity(res);
        this.searchType = 'filters';
        goToTop(0);
      } );
      return;
    }

    this.isSearching = true;

    this.tiendaService.searchByFilters(this.filtersToApply, false, this.filtersPage)
      .subscribe( (res: any) => {
        this.products = res.products;
        this.productsCount = res.productsLength;

        this.getPagesQuantity(res);
        this.searchType = 'filters';
        this.isSearching = false;
        goToTop(0);
      } );
  }
}
