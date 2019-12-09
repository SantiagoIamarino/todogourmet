import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../admin/orders.service';
import { LoadingService } from '../../shared/loading/loading.service';


declare var swal;

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  orders: any[] = [];

  orderToShow: any;

  filter = '';

  constructor(
    private ordersService: OrdersService,
    private loadingService: LoadingService
  ) {
    this.getOrders();
   }

  ngOnInit() {
  }

  setOrder(order) {
    this.orderToShow = order;
  }

  getOrders() {
    this.loadingService.loading = true;

    this.ordersService.getUserOrders().subscribe( (res: any) => {
      this.orders = res.orders;
      this.loadingService.loading = false;
    });
  }

  applyFilter() {
    if (!this.filter) {
      this.getOrders();
      return;
    }

    this.ordersService.getUserOrdersByFilter(this.filter).subscribe( (res: any) => {
      this.orders = res.orders;
    } );
  }

}
