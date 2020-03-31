import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../orders.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { User } from '../../../../models/user.model';

declare var swal;

declare function showBarCode(product);

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orders: any[] = [];

  orderToShow: any;
  productToShowBarCode: any;

  userToShow: User;

  filter = {
    status: '',
    date: ''
  };

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
    this.showBarCodes();
  }

  setUser(user: User) {
    this.userToShow = user;
    console.log(this.userToShow);
  }

  getOrders() {
    this.loadingService.loading = true;

    this.ordersService.getOrders().subscribe( (res: any) => {
      this.orders = res.orders;
      this.loadingService.loading = false;
    });
  }

  showBarCodes() {
    this.orderToShow.products.forEach(product => {
      setTimeout(() => {
        showBarCode(product);
      }, 100);
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
