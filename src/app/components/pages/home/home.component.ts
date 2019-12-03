import { Component, OnInit, OnDestroy  } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../shared/loading/loading.service';
import { ProductService } from '../../../services/product.service';
import { Product } from 'src/app/models/product.model';
import { ConfigurationService } from '../admin/configuration.service';

declare function sliderMarcas(imgsToSlide);

declare function scrollToDiv(slideTo);

declare function stopSliderMarcas();

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  products: Product[] = [];

  marcas: any[] = [];

  bannerImages: any[] = [];

  constructor(
    private homeService: HomeService,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private productsService: ProductService,
    private configurationService: ConfigurationService
  ) {
    this.getMarcas();
    this.getBannerImages();
   }

  ngOnInit() {
    this.route.paramMap.subscribe( params => {
      if (params.get('scrollTo')) {
        const scrollTo = params.get('scrollTo');
        scrollToDiv(scrollTo);
      }
      this.getPosts();
    } );
  }

  ngOnDestroy() {
   stopSliderMarcas();
  }

  getPosts() {
    this.loadingService.loading = true;
    this.productsService.getProducts(4).subscribe( (products: any) => {
      this.products = products;
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

}
