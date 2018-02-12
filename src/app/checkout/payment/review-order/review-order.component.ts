import { Component, OnInit, Input } from '@angular/core';
import { CartItem } from './../../../core/models/cart_item';

@Component({
  selector: 'app-review-order',
  templateUrl: './review-order.component.html',
  styleUrls: ['./review-order.component.scss']
})
export class ReviewOrderComponent implements OnInit {
  @Input() shipAddress: any = {};
  @Input() billAddress: any = {};
  @Input() orderTotal: any = {};
  @Input() cartItems: CartItem[];
  @Input() deliveryDate: any = {};
  timeSlotLabels: Array<string> = ['8:00AM - 11:00AM','11:00AM - 2:00PM','2:00PM - 5:00PM','5:00PM - 8:00PM'];

  constructor() { }

  ngOnInit() {
  }

  getTimeSlotLabel(index: number): string {
    return this.timeSlotLabels[index-1];
  }

}
