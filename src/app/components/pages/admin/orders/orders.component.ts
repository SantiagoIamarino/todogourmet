import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../orders.service';
import { LoadingService } from '../../../shared/loading/loading.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orders: any[] = [];

  constructor(
    private ordersService: OrdersService,
    private loadingService: LoadingService
  ) {
    this.getOrders();
   }

  ngOnInit() {
  }

  getOrders() {
    this.loadingService.loading = true;

    this.ordersService.getOrders().subscribe( (res: any) => {
      this.orders = res.orders;
      this.loadingService.loading = false;
      console.log(res);
    });
  }

}
