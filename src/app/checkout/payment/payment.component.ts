import { CheckoutService } from './../../core/services/checkout.service';
import { CheckoutActions } from './../actions/checkout.actions';
import { getOrderId, getShipAddress, getBillAddress, getDeliveryDate,
  getTotalCartItems, getTotalCartValue, getCartItems, getOrderState } from './../reducers/selectors';
import { AppState } from './../../interfaces';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, OnDestroy, ViewChild, Input, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DISABLED } from '@angular/forms/src/model';
import { spawn } from 'child_process';
import { Router } from '@angular/router';
import { CartItem } from './../../core/models/cart_item';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"]

})

export class PaymentComponent implements OnInit {
  gcForm: FormGroup;
  @ViewChild('cod') paymentCOD;
  @ViewChild('giftcert') paymentGC;
  @ViewChild('giftcertDetailsModal') giftcertDetailsModal;
  @ViewChild('gCode') gCode:ElementRef;
  @ViewChild('addGC') addGC: ElementRef;
  gcSelected: boolean = false;
  isShowErrMsg: boolean = false;
  customClass: string = "customClass";
  totalCartValue$: Observable<number>;
  totalCartItems$: Observable<number>;
  shipAddress$: Observable<any>;
  billAddress$: Observable<any>;
  deliveryDate$: Observable<any>;
  orderNumber$: Observable<string>;
  orderTotal$: Observable<number>;
  cartItems$: Observable<CartItem[]>;
  totalAmountDue: number = 0;
  orderStatus: string;
  disable: boolean = true;
  bCodeEntered: boolean = false;
  orderId: number;
  gcQuantity: number = 0;
  codText: string;
  gcText: string;
  gcCode: string;
  totalAmount: number;
  tmpAmt: number = 0;
  paymentTotal: number = 0;
  totalGCAmount: number = 0;
  usableGCcount: number = 0;
  totalAmount$: Observable<number>;
  updategcStatus$: Subscription;
  errMsg: string;


  constructor(private store: Store<AppState>,
    private router: Router,
    private fb: FormBuilder,
    private checkoutService: CheckoutService
    ) {
    this.store.select(getOrderId).subscribe(id => this.orderId = id);
    this.store.select(getOrderState).subscribe(status => this.orderStatus = status);
    this.shipAddress$ = this.store.select(getShipAddress);
    this.billAddress$ = this.store.select(getBillAddress);
    this.orderTotal$ = this.store.select(getTotalCartValue);
    this.cartItems$ = this.store.select(getCartItems);
    this.deliveryDate$ = this.store.select(getDeliveryDate);


  }

  ngOnInit() {
    this.initForm();
    this.orderTotal$.subscribe(val => {
      this.totalAmount = val;
      this.totalGCAmount = 0.00;
      this.tmpAmt = this.totalAmount;
      this.totalAmountDue = this.tmpAmt;

    });

  }

  initForm() {
    const gcCode = '';
    this.gcForm = this.fb.group({
  	  'gc-code': [gcCode ] }
    );
  }


  addGiftCert(code){
    if(code.value != ''){
      this.totalAmount$ = this.checkoutService.getGC(code.value).map(data => {
        if(data.message != null) {
          console.log('ERROR');
          this.errMsg = data.message;
          return this.totalGCAmount;
        } else if (data.status == "used") {
          console.log('ERROR');
          this.errMsg = "Already used!";
          return this.totalGCAmount;
        }
        else {
          console.log("update gc table");
          this.updateGCStatus(code.value);
          this.errMsg = null;
          this.gcQuantity++;
          this.gcCount();
          this.gCode.nativeElement.value = '';
          return this.totalGCAmount += Number(data.amount);
        }
      })

    } else {
      this.isShowErrMsg = true;
    }
  }

  gcCount(){
    this.usableGCcount = Math.floor(this.tmpAmt / 100);
    this.usableGCcount = this.usableGCcount - this.gcQuantity;
    console.log('usable GCs - '+this.usableGCcount);
  }

  goBack(){
    this.router.navigate(['/checkout', 'address', {deliveryOptions: true}]);
  }

  updateGCStatus(code){
    this.updategcStatus$ = this.checkoutService.updateGC_status(code).subscribe(data => data);
  }

  confirmOrder(){
    console.log('confirm order');
    let params: any = {};
    let isPaymentMode = false;

    if (this.paymentCOD == 0) {
      params = {
        orderId: this.orderId,
        paymentMode: 'COD',
        paymentInstructions: this.codText,
        status: 'payment'
      }
      isPaymentMode = true;
    } else {
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

  ngOnDestroy() {

  }

}
