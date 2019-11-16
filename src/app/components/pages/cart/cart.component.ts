import { Component, OnInit } from '@angular/core';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  preference: any;

  constructor(
    private cartService: CartService
  ) { }

  ngOnInit() {
  }

  checkout() {
    this.cartService.checkOutMP().subscribe( (res: any) => {
      if (res.response && res.ok) {
        this.preference = res.response;
        console.log(this.preference);
      }
    } );
  }

}
