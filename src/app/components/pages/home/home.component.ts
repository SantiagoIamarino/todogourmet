import { Component, OnInit, OnDestroy  } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { ActivatedRoute } from '@angular/router';

declare function sliderMarcas(imgsToSlide);

declare function scrollToDiv(slideTo);

declare function stopSliderMarcas();

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  marcas: any[] = [];

  constructor(
    private homeService: HomeService,
    private route: ActivatedRoute
  ) {
    this.getMarcas();
   }

  ngOnInit() {
    this.route.paramMap.subscribe( params => {
      if (params.get('scrollTo')) {
        const scrollTo = params.get('scrollTo');
        scrollToDiv(scrollTo);
      }
    } );
  }

  ngOnDestroy(){
   stopSliderMarcas();
  }

  getMarcas() {
    this.homeService.getMarcas().subscribe( marcas => {
      this.marcas = marcas;
      sliderMarcas(this.marcas.length);
    } );
  }

}
