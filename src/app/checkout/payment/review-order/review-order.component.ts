import { Component, OnInit, Input } from '@angular/core';
import { CartItem } from './../../../core/models/cart_item';
import { Globals } from './../../../globals';

@Component({
  selector: 'app-review-order',
  templateUrl: './review-order.component.html',
  styleUrls: ['./review-order.component.scss']
})
export class ReviewOrderComponent implements OnInit {
  @Input() shipAddress: any = {};
  @Input() billAddress: any = {};
  @Input() orderTotal: any = {};
  @Input() cartTotal: any = {};
  @Input() amountDue: any = {};
  @Input() cartItems: CartItem[];
  @Input() deliveryDate: any = {};
  @Input() gcAmount: number;
  @Input() discount: number;
  serviceFee: number = 0;
  deliveryFee: number = 0;
  grandTotal: number = 0;


  constructor(
    private globals: Globals,
  ) { }

  ngOnInit() {
    let settings = localStorage.getItem('settings');
    settings = JSON.parse(settings);
    let sFee = settings[1];
    let dFee = settings[0];
    this.deliveryFee = Number(dFee[`value`]);
    this.serviceFee = Number(sFee[`value`]);
    //this.grandTotal = this.orderTotal + this.serviceFee + this.deliveryFee - this.discount;
    //this.cartTotal = this.orderTotal - this.gcAmount;
  }

  getTimeSlotLabel(index: number): string {
    return this.globals.TIMESLOT_LABELS[index-1];
  }

}
