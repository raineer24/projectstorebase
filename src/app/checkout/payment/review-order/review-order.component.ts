import { Component, OnInit, Input } from '@angular/core';
import { CartItem } from './../../../core/models/cart_item';

@Component({
  selector: 'app-review-order',
  templateUrl: './review-order.component.html',
  styleUrls: ['./review-order.component.scss']
})
export class ReviewOrderComponent implements OnInit {
  @Input() shipAddress: {};
  @Input() billAddress: {};
  @Input() orderTotal: {};
  @Input() cartItems: CartItem[];

  constructor() { }

  ngOnInit() {
  }

}
