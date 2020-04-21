import { Component, OnInit, OnDestroy  } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../shared/loading/loading.service';
import { ProductService } from '../../../services/product.service';
import { Product } from 'src/app/models/product.model';
import { ConfigurationService } from '../admin/configuration.service';

declare function sliderMarcas(imgsToSlide);

declare function scrollToDiv(slideTo, timing);

declare function stopSliderMarcas();

declare function showProductInfoModal();

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  products: Product[] = [];

  marcas: any[] = [];

  bannerImages: any[] = [];
  pricesList = '';

  productToShowMoreInfo: Product;

  constructor(
    private homeService: HomeService,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private productsService: ProductService,
    private configurationService: ConfigurationService
  ) {
    this.getMarcas();
    this.getBannerImages();
    this.getPricesList();

    this.productsService.showProductInfoModal.subscribe( (product: Product) => {
      this.productToShowMoreInfo = product;
      showProductInfoModal();
    } );
   }

  ngOnInit() {
    this.route.paramMap.subscribe( params => {
      if (params.get('scrollTo')) {
        const scrollTo = params.get('scrollTo');
        scrollToDiv(scrollTo, 0);
      }
    } );
    this.getPosts();
  }

  ngOnDestroy() {
   stopSliderMarcas();
  }

  getPosts() {
    this.loadingService.loading = true;
    this.productsService.getDestacados().subscribe( (products: any) => {

      products = products.filter((product) => {
        // tslint:disable-next-line: radix
        if (!product.stock || product.stock === 'ilimitado' || parseInt(product.stock) > 0 ) {
          return product;
        }
      });

      if (products.length > 4) {
        for (let i = 0; i < 4; i++) {
          const index = Math.floor(Math.random() * products.length);
          this.products.push(products[index]);
          products.splice(index, 1);
        }
      } else {
        this.products = products;
      }
      this.loadingService.loading = false;
    } );
  }

  getMarcas() {
    this.homeService.getMarcas().subscribe( marcas => {
      this.marcas = marcas;
      sliderMarcas(this.marcas.length);
    } );
  }

  getBannerImages() {
    this.configurationService.getBannerImages().subscribe( images => {
      this.bannerImages = images;
    } );
  }

  getPricesList() {
    this.configurationService.getConfigs().subscribe( (res: any) => {
      this.pricesList = res.configs[0].pricesList;
    }  );
  }

  redirectTo(link: string) {
    if (link) {
      let url = '';
      if (!/^http[s]?:\/\//.test(link)) {
          url += 'http://';
      }

      url += link;
      window.open(url, '_blank');
    }
  }

}
