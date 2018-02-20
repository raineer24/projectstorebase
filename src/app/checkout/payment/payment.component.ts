import { CheckoutService } from './../../core/services/checkout.service';
import { CheckoutActions } from './../actions/checkout.actions';
import { getOrderId, getShipAddress, getBillAddress, getDeliveryDate,
  getTotalCartItems, getTotalCartValue, getCartItems, getOrderState } from './../reducers/selectors';
import { AppState } from './../../interfaces';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
  @ViewChild('group1') paymentCOD;
  @ViewChild('group2') paymentGC;
  @ViewChild('giftcertDetailsModal') giftcertDetailsModal;
  oneAtATime: boolean = true;
  gcSelected: boolean = false;
  customClass: string = "customClass";
  totalCartValue$: Observable<number>;
  totalCartItems$: Observable<number>;
  shipAddress$: Observable<any>;
  billAddress$: Observable<any>;
  deliveryDate$: Observable<any>;
  orderNumber$: Observable<string>;
  orderTotal$: Observable<number>;
  cartItems$: Observable<CartItem[]>;
  orderStatus: string;
  disable: boolean = true;
  bCodeEntered: boolean = false;
  orderId: number;
  gcQuantity: number = 0;
  codText: string;
  gcText: string;
  gcCode: string;

  constructor(private store: Store<AppState>,
    private router: Router,
    private fb: FormBuilder,
    private checkoutService: CheckoutService
    ) {
    this.store.select(getOrderId).subscribe(id => this.orderId = id);
    this.store.select(getOrderState).subscribe(status => this.orderStatus = status)
    this.shipAddress$ = this.store.select(getShipAddress);
    this.billAddress$ = this.store.select(getBillAddress);
    this.orderTotal$ = this.store.select(getTotalCartValue);
    this.cartItems$ = this.store.select(getCartItems);
    this.deliveryDate$ = this.store.select(getDeliveryDate);
  }

  ngOnInit() {
    // console.log(this.orderStatus)
    // if(this.orderStatus != 'payment') {
    //   this.router.navigate(['/']);
    // }
  }

  addGiftCert(){
    this.gcQuantity++;
  }

  goBack(){
    this.router.navigate(['/checkout', 'address', {deliveryOptions: true}]);
  }

  confirmOrder(){
    let params: any = {};
    let isPaymentMode = false;

    if (this.paymentCOD.isOpen) {
      params = {
        orderId: this.orderId,
        paymentMode: 'COD',
        paymentInstructions: this.codText,
        status: 'payment'
      }
      isPaymentMode = true;
    } else if (this.paymentGC.isOpen) {
      params = {
        orderId: this.orderId,
        paymentMode: 'GC',
        paymentInstructions: this.gcText,
        referenceId: this.gcCode,
        status: 'payment'
      }
      isPaymentMode = true;
    }

    if(isPaymentMode) {
      this.checkoutService.updateOrderPayment(params
        ).do(() => {
          this.router.navigate(['/checkout', 'confirm']);
        }).subscribe();
    }
  }
}
