import { Component, OnInit } from '@angular/core';
import { StockService } from '../../../../services/stock.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  alerts: any[] = [];

  constructor(
    private stockService: StockService
  ) {
    this.getStockAlerts();
   }

  ngOnInit() {
  }

  getStockAlerts() {
    this.stockService.getStockAlerts()
      .subscribe((res: any) => {
        this.alerts = res.alerts;
      });
  }

}
