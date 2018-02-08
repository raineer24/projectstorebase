import { CheckoutService } from './../../core/services/checkout.service';
import { CheckoutActions } from './../actions/checkout.actions';
import { getOrderId, getShipAddress, getBillAddress,
  getTotalCartItems, getTotalCartValue, getCartItems } from './../reducers/selectors';
import { AppState } from './../../interfaces';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DISABLED } from '@angular/forms/src/model';
import { spawn } from 'child_process';
import { Router } from '@angular/router';
import { CartItem } from './../../core/models/cart_item';


@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"]

})

export class PaymentComponent implements OnInit {


  oneAtATime: boolean = true;

  customClass: string = "customClass";
  totalCartValue$: Observable<number>;
  totalCartItems$: Observable<number>;
  shipAddress$: Observable<any>;
  billAddress$: Observable<any>;
  orderNumber$: Observable<string>;
  orderTotal$: Observable<number>;
  cartItems$: Observable<CartItem[]>;
  disable: boolean = true;
  orderId: number;

  constructor(private store: Store<AppState>,
    private router: Router,
    private checkoutService: CheckoutService
    ) {
    this.store.select(getOrderId).subscribe(id => this.orderId = id);
    this.shipAddress$ = this.store.select(getShipAddress);
    this.billAddress$ = this.store.select(getBillAddress);
    this.orderTotal$ = this.store.select(getTotalCartValue);
    this.cartItems$ = this.store.select(getCartItems);
  }

  ngOnInit() {
  }

  goBack(){
    this.router.navigate(['/checkout', 'address', {deliveryOptions: true}]);
  }

  confirmOrder(){
    this.checkoutService.updateOrderPayment(this.orderId
      ).do(() => {
        this.router.navigate(['/checkout', 'confirm']);
      }).subscribe();
  }
}
