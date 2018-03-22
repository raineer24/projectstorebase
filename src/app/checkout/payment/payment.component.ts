import { CheckoutService } from './../../core/services/checkout.service';
import { CheckoutActions } from './../actions/checkout.actions';
import { getOrderId, getShipAddress, getBillAddress, getDeliveryDate, getGiftCerts, getGrandTotal,
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
  @ViewChild('appCoupon') appCoupon:ElementRef;
  @ViewChild('gc') gc:ElementRef;
  @Input() discount: number = 0;
  gcSelected: boolean = false;
  isShowErrMsg: boolean = false;
  customClass: string = "customClass";
  totalCartValue$: Observable<number>;
  totalCartItems$: Observable<number>;
  totalDiscount$:Observable<number>;
  totalAmountDue$: Observable<number>;
  totalAmountPaid$: Observable<number>
  tempDiscount$: Observable<any>;
  shipAddress$: Observable<any>;
  billAddress$: Observable<any>;
  deliveryDate$: Observable<any>;
  orderNumber$: Observable<string>;
  orderTotal$: Observable<number>;
  cartTotal$: Observable<number>;
  cartItems$: Observable<CartItem[]>;
  isAuthenticated$: Observable<boolean>;
  giftCertList$:Observable<any>;
  cartItemIds: Array<number>;
  totalAmountDue: number = 0;
  orderStatus: string;
  orderId: number;
  instructionsText: string = '';
  gcQuantity: number = 0;
  gcCode: string;
  deliveryFee: number = 100.00;
  serviceFee: number = 100.00
  totalAmount: number = 0;
  paymentTotal: number = 0;
  totalPaidAmount: number = 0;
  totalDiscount: number = 0;
  usableGCcount: number = 0;
  paymentHolder: number = 0;
  totalAmount$: Observable<number>;
  totalAmtDue: number = 0;
  updategcStatus$: Subscription;
  discount$: Subscription;
  vErrMsg: string;
  gErrMsg: string = " ";
  hasErr: boolean = false;
  forGC: any;
  bCouponEntered: boolean = false;
  gcList: any;
  voucherCode: any;
  forCoupon: any;
  voucherIcon: string;
  couponCode: string;
  inputTxt: string;
  checkedGC: boolean = false;
  checkedCash: boolean = true;
  checkedPP: boolean = false;
  checkedCC: boolean = false;
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
    this.cartTotal$ = this.store.select(getTotalCartValue);
    this.orderTotal$ = this.store.select(getGrandTotal);
    this.tempDiscount$ = this.store.select(getTotalDiscount);
    this.totalAmountPaid$ = this.store.select(getTotalAmtPaid);
    this.totalAmountDue$ = this.store.select(getTotalAmtDue);
    this.cartItems$ = this.store.select(getCartItems);
    this.deliveryDate$ = this.store.select(getDeliveryDate);
    this.isAuthenticated$ = this.store.select(getAuthStatus);
    this.giftCertList$ = this.store.select(getGiftCerts);
  }

  setDefault() {
    this.gErrMsg = '';
    this.voucherIcon = 'glyphicon glyphicon-tag text-default';
    this.couponCode = '';
  }

  ngOnInit() {
    this.gcList = [];
    this.store.select(getGiftCerts).takeUntil(this.componentDestroyed).subscribe(gc => {
        this.gcList = gc.map(gcert => gcert[0]);
        if(this.gcList.length) {
          this.gcQuantity = this.gcList.length;
          this.checkedGC = true;
        }
        this.initForm();
    });

    if(this.gcList.length < 1)
    {
      this.gcList = localStorage.getItem('giftcert');
      this.gcQuantity = this.gcList ? this.gcList.length : 0;
      this.checkedGC = true;
      console.log(this.gcList);
      this.initForm();
    }

    this.orderTotal$.takeUntil(this.componentDestroyed).subscribe(val => {
      this.totalAmount = val - this.totalDiscount;
      this.totalPaidAmount = 0.00;
    });
    this.cartItems$.takeUntil(this.componentDestroyed).subscribe(cartItems => {
      this.cartItemIds = cartItems.map(cartItem => cartItem.item_id);
    });
    this.totalAmountDue$.takeUntil(this.componentDestroyed).subscribe(val => {
      this.totalAmountDue = val;
    });
    this.tempDiscount$.takeUntil(this.componentDestroyed).subscribe(val => {
      this.totalDiscount = val;
    });
    return this.gcList;
  }

  initForm() {
    const gcCode = '';
    this.gcForm = this.fb.group({
  	  'gc-code': [gcCode ] }
    );
    this.setDefault();
  }

//new voucher validation
  checkVoucher(){
    if(this.couponCode.length > 4) {
      this.discount$ = this.checkoutService.getvoucher(Number(this.couponCode)).subscribe(data => {
        // if(this.bCouponEntered){
        //   this.store.dispatch(this.checkoutAction.removeCoupon());
        //   this.bCouponEntered = false;
        // }
        if(data.message != null) {
            // this.gErrMsg = 'Invalid coupon or voucher';
            this.voucherIcon = 'glyphicon glyphicon-remove text-danger';
            this.hasErr = true;
        } else if (data.status == "used") {
            // this.gErrMsg = 'Coupon or voucher already consumed';
            this.voucherIcon = 'glyphicon glyphicon-remove text-danger';
            this.hasErr = true;
        } else {
            // this.gErrMsg = 'Coupon or voucher is valid!';
            this.voucherIcon = 'glyphicon glyphicon-ok text-success';
            this.hasErr = false;
            // this.coupon.nativeElement.value = code.value;
        }
      });
    } else {
      this.hasErr = true;
    }

  }

  applyVoucher(){
    if(!this.hasErr && this.couponCode){
      let c = this.couponCode;
      this.discount$ = this.checkoutService.getvoucher(Number(this.couponCode)).subscribe(data => {
        this.discount = Number(data.discount);

        this.totalAmountDue = this.totalAmount - Number(data.discount);
        this.forCoupon = {
          value: Number(data.discount)
        };
        this.store.dispatch(this.checkoutAction.applyCoupon(this.forCoupon));

        // this.couponCode = this.voucherCode;
      });
      this.bCouponEntered = true;
      this.inputTxt = c;
    }
    return this.totalAmountDue;
  }

  removeVoucher(){
    this.discount$ = this.checkoutService.getvoucher(Number(this.couponCode)).subscribe(data => {
      this.store.dispatch(this.checkoutAction.removeCoupon());
      this.bCouponEntered = false;
      this.setDefault();
    });
    return this.totalAmountDue;
  }

  addGiftCert(code){
    let tempList = [];
    let amountPaid = 0;
    if(code.value != ''){
      this.totalAmountPaid$ = this.checkoutService.getGC(Number(code.value)).map(data => {
        if(data.message != null) {
          // this.gErrMsg = data.message;
          this.checkoutService.showErrorMsg('giftcert');
          return this.totalPaidAmount;
        } else if (data.status == "used") {
          // this.gErrMsg = "Already used!";
          this.checkoutService.showErrorMsg('giftcert');
          return this.totalPaidAmount;
        } else {
          console.log("update gc table");
          this.gcList.push({
            code: code.value,
            value: data.amount
          });
          tempList.push({
            code: code.value,
            value: data.amount
          });;
          this.updateGCStatus(code.value);
          amountPaid = Number(data.amount);
          // this.totalAmountDue = this.totalAmountDue - this.totalPaidAmount;
          this.forGC = {
              value: amountPaid,
              gCerts: tempList
            }
          this.gErrMsg = null;
          this.gcQuantity++;
          this.gcCount();
          this.store.dispatch(this.checkoutAction.applyGC(this.forGC));
          this.gCode.nativeElement.value = '';
          this.totalPaidAmount += amountPaid;
          this.paymentHolder = this.totalPaidAmount;
          return this.totalPaidAmount;
        }
      })

    } else {
      this.isShowErrMsg = true;
    }
  }

  gcCount(){
    this.usableGCcount = Math.floor(this.totalAmount / 100);
    this.usableGCcount = this.usableGCcount - this.gcQuantity;
  }

  goBack(){
    this.router.navigate(['/checkout', 'address', {deliveryOptions: true}]);
  }

  updateGCStatus(code){
    this.updategcStatus$ = this.checkoutService.updateGC_status(code).subscribe(data => data);
  }

  confirmOrder(){
    const orderKey = this.checkoutService.getOrderKey();
    let grandTotal = this.totalAmount;
    let params: any = {};
    params = {
      id: this.orderId,
      specialInstructions: this.instructionsText,
      paymentTotal: this.paymentHolder,
      discountTotal: this.discount,
      adjustmentTotal: this.totalAmountDue,
      total: grandTotal,
      status: 'payment'
    }

    this.checkoutService.updateOrderPayment(params
    ).mergeMap(res => {
      if(res.message.indexOf('Processed') >= 0) {
        this.router.navigate(['/checkout', 'confirm', orderKey]);
        return this.checkoutService.updateVoucherStatus(this.voucherCode);
      }

    }).subscribe();

  }

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.unsubscribe();
  }

}
