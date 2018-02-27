import { CheckoutService } from './../../core/services/checkout.service';
import { CheckoutActions } from './../actions/checkout.actions';
import { getOrderId, getShipAddress, getBillAddress, getDeliveryDate,
  getTotalCartItems, getTotalCartValue, getCartItems, getOrderState, getTotalDiscount, getTotalAmtDue, getTotalAmtPaid } from './../reducers/selectors';
import { getAuthStatus } from './../../auth/reducers/selectors';
import { AppState } from './../../interfaces';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
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
  @ViewChild('giftcertDetailsModal') giftcertDetailsModal;
  @ViewChild('gCode') gCode:ElementRef;
  @ViewChild('addGC') addGC: ElementRef;
  gcSelected: boolean = false;
  isShowErrMsg: boolean = false;
  customClass: string = "customClass";
  totalCartValue$: Observable<number>;
  totalCartItems$: Observable<number>;
  totalDiscount$:Observable<number>;
  totalAmountDue$: Observable<number>;
  totalAmountPaid$: Observable<number>
  shipAddress$: Observable<any>;
  billAddress$: Observable<any>;
  deliveryDate$: Observable<any>;
  orderNumber$: Observable<string>;
  orderTotal$: Observable<number>;
  cartItems$: Observable<CartItem[]>;
  isAuthenticated$: Observable<boolean>;
  cartItemIds: Array<number>;
  totalAmountDue: number = 0;
  orderStatus: string;
  orderId: number;
  instructionsText: string = '';
  gcQuantity: number = 0;
  gcCode: string;
  deliveryFee: number = 100.00;
  serviceFee: number = 100.00
  totalAmount: number;
  tmpAmt: number = 0;
  paymentTotal: number = 0;
  totalPaidAmount: number = 0;
  usableGCcount: number = 0;
  totalAmount$: Observable<number>;
  updategcStatus$: Subscription;
  errMsg: string;
  forGC: any;
  private componentDestroyed: Subject<any> = new Subject();


  constructor(
    private store: Store<AppState>,
    private router: Router,
    private fb: FormBuilder,
    private checkoutService: CheckoutService,
    private checkoutAction: CheckoutActions
  ) {
    this.store.select(getOrderId).subscribe(id => this.orderId = id);
    this.store.select(getOrderState).subscribe(status => this.orderStatus = status);
    this.shipAddress$ = this.store.select(getShipAddress);
    this.billAddress$ = this.store.select(getBillAddress);
    this.orderTotal$ = this.store.select(getTotalCartValue);
    this.totalDiscount$ = this.store.select(getTotalDiscount);
    this.totalAmountPaid$ = this.store.select(getTotalAmtPaid);
    this.totalAmountDue$ = this.store.select(getTotalAmtDue);
    this.cartItems$ = this.store.select(getCartItems);
    this.deliveryDate$ = this.store.select(getDeliveryDate);
    this.isAuthenticated$ = this.store.select(getAuthStatus);
  }

  ngOnInit() {
    this.initForm();
    this.orderTotal$.takeUntil(this.componentDestroyed).subscribe(val => {
      this.totalAmount = val;
      this.totalPaidAmount = 0.00;
      this.tmpAmt = this.totalAmount;
      this.totalAmountDue = this.tmpAmt;
    });
    this.cartItems$.takeUntil(this.componentDestroyed).subscribe(cartItems => {
      this.cartItemIds = cartItems.map(cartItem => cartItem.item_id);
    });
    this.totalAmountDue$.takeUntil(this.componentDestroyed).subscribe(val => {
      this.totalAmountDue = val;
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
          this.errMsg = data.message;
          return this.totalPaidAmount;
        } else if (data.status == "used") {
          this.errMsg = "Already used!";
          return this.totalPaidAmount;
        } else {
          console.log("update gc table");
          this.updateGCStatus(code.value);
          console.log(data.amount);
          // this.totalPaidAmount = this.totalPaidAmount + Number(data.amount);
          this.totalPaidAmount = this.totalPaidAmount + Number(data.amount);
          this.totalAmountDue = this.totalAmountDue - Number(data.amount);
          this.forGC = {
              value: this.totalPaidAmount,
              amtDue: this.totalAmountDue
            }
          this.errMsg = null;
          this.gcQuantity++;
          this.gcCount();
          this.store.dispatch(this.checkoutAction.applyGC(this.forGC));
          this.gCode.nativeElement.value = '';
          return this.totalPaidAmount;
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
    const orderKey = this.checkoutService.getOrderKey();
    let grandTotal = this.totalAmount + this.serviceFee + this.deliveryFee;
    let params: any = {};
    params = {
      id: this.orderId,
      specialInstructions: this.instructionsText,
      paymentTotal: this.totalPaidAmount,
      adjustmentTotal: this.totalAmountDue,
      total: grandTotal,
      status: 'payment'
    }

    this.checkoutService.updateOrderPayment(params
    ).subscribe(res => {
      if(res.message.indexOf('Processed') >= 0) {
        this.router.navigate(['/checkout', 'confirm', orderKey]);
      }
    });
  }

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.unsubscribe();
  }

}
