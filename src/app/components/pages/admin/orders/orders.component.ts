import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../orders.service';
import { LoadingService } from '../../../shared/loading/loading.service';

declare var swal;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

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

    this.ordersService.getOrders().subscribe( (res: any) => {
      this.orders = res.orders;
      this.loadingService.loading = false;
    });
  }

  changeState(order) {

    if (order.status === 'PENDING') {
      order.status = 'FINISHED';
    } else {
      order.status = 'PENDING';
    }

    this.ordersService.updateOrder(order).subscribe( (res: any) => {
      swal('Estado acutalizado', res.message, 'success');

      if (this.filter) {
        this.applyFilter();
      } else {
        this.getOrders();
      }
    } );
  }

  applyFilter() {
    if (!this.filter) {
      this.getOrders();
      return;
    }

    this.ordersService.getOrdersByFilter(this.filter).subscribe( (res: any) => {
      this.orders = res.orders;
    } );
  }

}
