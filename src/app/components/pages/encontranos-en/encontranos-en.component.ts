import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../shared/loading/loading.service';

declare function goToTop(animationTime);

@Component({
  selector: 'app-encontranos-en',
  templateUrl: './encontranos-en.component.html',
  styleUrls: ['./encontranos-en.component.css']
})
export class EncontranosEnComponent implements OnInit {

  constructor(
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    goToTop(0);
    this.loadingService.loading = false;
  }

}
