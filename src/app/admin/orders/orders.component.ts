import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Array<any>;

  constructor() { }

  ngOnInit() {
    this.orders = Array.from('lorem ipsmu'.repeat(20));
  }

}
