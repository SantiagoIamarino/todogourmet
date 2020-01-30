import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../shared/loading/loading.service';

declare function goToTop(animationTime);

@Component({
  selector: 'app-quienes-somos',
  templateUrl: './quienes-somos.component.html',
  styleUrls: ['./quienes-somos.component.css']
})
export class QuienesSomosComponent implements OnInit {

  constructor(
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    goToTop(0);
    this.loadingService.loading = false;
  }

}
