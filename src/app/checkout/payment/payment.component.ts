import { CheckoutService } from './../../core/services/checkout.service';
import { AuthService } from './../../core/services/auth.service';
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
  @ViewChild('gCode') gCode:ElementRef;
  @ViewChild('gc') gc:ElementRef;
  @ViewChild('cod') cod:ElementRef;
  @Input() discount: number = 0;
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
  pbuDetails$: Subscription;
  transactiondetails$: Subscription;
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
  deliveryFee: number;
  serviceFee: number;
  totalAmount: number = 0;
  paymentTotal: number = 0;
  paymentType: string;
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
  bCouponEntered: boolean;
  gcList: any;
  updateCoupon: any;
  couponContainer: any;
  voucherCode: any;
  forCoupon: any;
  voucherIcon: string;
  couponCode: string;
  checkedGC: boolean = false;
  checkedCash: boolean = true;
  checkedPP: boolean = false;
  checkedCC: boolean = false;
  checkedPBU: boolean = false;
  PBUcontainer: any;
  availableCredit: number = 0.00;
  availableBalance: number = 0.00;
  outstandingBalance: number = 0.00;
  pEmail: string;
  isPBU: boolean = false;
  bDisabled: boolean = false;
  bcashChecked: boolean;
  pbuEmail: string = "";
  userData: any;
  selleruser: any;
  deliveryDate: any;
  pbucheckbox: any;
  private componentDestroyed: Subject<any> = new Subject();


  constructor(
    private store: Store<AppState>,
    private router: Router,
    private fb: FormBuilder,
    private checkoutService: CheckoutService,
    private checkoutAction: CheckoutActions,
    private authService: AuthService
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
    this.bCouponEntered = false;
    this.paymentType = "CASH";
    let settings = localStorage.getItem('settings');
    settings = JSON.parse(settings);
    let sFee = settings[0];
    let dFee = settings[1];
    this.serviceFee = Number(sFee['value']);
    this.deliveryFee = Number(dFee['value']);
    this.bcashChecked = true;
    this.pEmail = "";
    this.paymentType = "";
    this.userData = localStorage.getItem('user');
    if(localStorage.getItem('pbu') !== null) {
      if(localStorage.getItem('pbu') === '1'){
        this.isPBU = true;
        this.PBUcontainer = JSON.parse(localStorage.getItem('PBUser'));
        this.availableBalance = this.PBUcontainer['availablebalance'];
        if(this.availableBalance === 0.00){
          this.bDisabled = true;
        } else {
          this.bDisabled = false;
        }
      } else {
        this.isPBU = false;
      }
    }
    this.voucherIcon = 'glyphicon glyphicon-tag text-default';
    this.gcList = [];
    if (localStorage.getItem('giftcert') == ''){
      this.store.select(getGiftCerts).takeUntil(this.componentDestroyed).subscribe(gc => {
        this.gcList = gc.map(gcert => gcert[0]);
        if (this.gcList.length) {
          this.gcQuantity = this.gcList.length;
          this.checkedGC = true;
        }
        this.initForm();
      });
    } else {
      this.totalAmountPaid$ = this.store.select(getTotalAmtPaid);
      // let storedData = JSON.parse(localStorage.getItem('giftcert'));
      if(localStorage.getItem('giftcert')){
        this.gcList = JSON.parse(localStorage.getItem('giftcert'));
        this.gcQuantity = this.gcList.length;
        this.checkedGC = true;
      }
    }

    this.orderTotal$.takeUntil(this.componentDestroyed).subscribe(val => {
      this.totalAmount = val - this.totalDiscount;
      // this.totalPaidAmount = 0.00;
    });
    this.cartItems$.takeUntil(this.componentDestroyed).subscribe(cartItems => {
      this.cartItemIds = cartItems.map(cartItem => cartItem.item_id);
    });
    this.totalAmountDue$.takeUntil(this.componentDestroyed).subscribe(val => {
      this.totalAmountDue = val;
    });
    this.tempDiscount$.takeUntil(this.componentDestroyed).subscribe(val => {
      this.totalDiscount = val;
      if(localStorage.getItem('discount') != '' && localStorage.getItem('discount') != '0'){
        this.discount = Number(localStorage.getItem('discount'));
        this.voucherCode = localStorage.getItem('voucher');
        this.bCouponEntered = true;
      }
    });
    this.deliveryDate$.takeUntil(this.componentDestroyed).subscribe(val => {
      this.deliveryDate = val;
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

  checkVoucher(){
    if(this.couponCode.length > 2) {
      this.discount$ = this.checkoutService.getvoucher(Number(this.couponCode)).subscribe(data => {
        if(data.message != null) {
            // this.gErrMsg = 'Invalid coupon or voucher';
            this.voucherIcon = 'glyphicon glyphicon-remove text-danger';
            this.hasErr = true;
            this.checkoutService.showErrorMsg('voucher','');
        } else if (data.status == "used") {
            // this.gErrMsg = 'Coupon or voucher already consumed';
            this.voucherIcon = 'glyphicon glyphicon-remove text-danger';
            this.hasErr = true;
            this.checkoutService.showErrorMsg('voucher','');
        } else {
            // this.gErrMsg = 'Coupon is valid!';
            this.voucherIcon = 'glyphicon glyphicon-ok text-success';
            this.hasErr = false;
            this.voucherCode = this.couponCode;
            this.updateCoupon = this.voucherCode;
        }
      });
    } else {
      this.voucherIcon = 'glyphicon glyphicon-tag text-default';
      this.hasErr = false;
    }

  }

  applyVoucher(){
    if(!this.hasErr && this.couponCode){
      this.discount$ = this.checkoutService.getvoucher(Number(this.couponCode)).subscribe(data => {
        this.discount = Number(data.discount);
        localStorage.setItem('discount',JSON.stringify(this.discount));
        this.totalAmountDue = this.totalAmount - Number(data.discount);
        this.forCoupon = {
          value: Number(data.discount)
        };
        this.store.dispatch(this.checkoutAction.applyCoupon(this.forCoupon));

        // this.couponCode = this.voucherCode;
      });
      this.bCouponEntered = true;
      this.voucherCode = this.couponCode;
      localStorage.setItem('voucher',this.voucherCode);
    }
  }

  removeVoucher(){
    this.discount$ = this.checkoutService.getvoucher(Number(this.voucherCode)).subscribe(data => {
      this.store.dispatch(this.checkoutAction.removeCoupon());
      this.bCouponEntered = false;

    });
    localStorage.setItem('voucher','');
    localStorage.setItem('discount','0');
    this.setDefault();
  }

  addGiftCertFilter(code){
    if(this.gcQuantity > 0) {
      if(this.gcList.find(gc => gc.code === code.value))
      {
        this.checkoutService.showErrorMsg('giftcert','');
      } else {
        this.addGiftCert(code);
      }
    }
    else  {
      this.addGiftCert(code);
    }
  }

  addGiftCert(code){
    let tempList = [];
    let amountPaid = 0;
    if(code.value != ''){
      this.totalAmountPaid$ = this.checkoutService.getGC(Number(code.value)).map(data => {
          if(data.message != null) {
            this.gErrMsg = "GC "+code.value+" not found!";
            this.checkoutService.showErrorMsg('giftcert',this.gErrMsg);
            return this.totalPaidAmount;
          } else if (data.status == "used") {
            this.gErrMsg = "GC "+code.value+" is no longer available!";
            this.checkoutService.showErrorMsg('giftcert',this.gErrMsg);
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
            });

            localStorage.setItem('giftcert',JSON.stringify(this.gcList));

            amountPaid = Number(data.amount);
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

  startReload() {
    setTimeout(function () {
        location.reload()
    }, 2500);
  }

  removeGC(code){
    let tempList = [];
    var index = this.gcList.indexOf(code);
    tempList.push({
      code: code,
      value: this.gcList.value
    });
    this.gcList.splice(index, 1);
    this.store.dispatch(this.checkoutAction.removeGC(tempList));
    this.startReload();
    return this.totalPaidAmount;
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

  validateOrder(){
      if(localStorage.getItem('pbu') !== '1'){
        this.confirmOrder();
      } else {
        if(this.checkedPBU){
          this.paymentType = "SALARY_DEDUCTION";
          if(this.availableBalance > this.totalAmountDue){
            this.paymentHolder = this.paymentHolder + this.totalAmountDue;
            let newBal = this.availableBalance - this.totalAmountDue;
            let pbuData = {
                useraccount_id: this.PBUcontainer['useraccount_id'],
                availablebalance: Number(newBal),
                outstandingbalance: Number(this.PBUcontainer['outstandingbalance']) + Number(this.totalAmountDue)
            };
            this.pbuDetails$ = this.authService.updatePartnerBuyerUser(pbuData).subscribe(data => {
              this.confirmOrder();
              this.authService.getPartnerBuyerUser(this.PBUcontainer['useraccount_id']).subscribe ( data => {
                localStorage.setItem('PBUser',JSON.stringify(data));
              });
            });
          }
          this.confirmOrder();
        } else {
          this.gErrMsg = "You do not have enough credit for this purchase.";
          this.checkoutService.showErrorMsg('pbuvoucher',this.gErrMsg);
        }
      }
    }

  checkPBUEmail(email): boolean{
    let ret = false;
    if(email !== ""){
      if(email === this.PBUcontainer['email'] ){
        this.pEmail = email;
        ret = true;
      } else {
        ret = false;
        this.gErrMsg = "Incorrect work email. Please enter correct work email!";
        this.checkoutService.showErrorMsg('pbuvoucher',this.gErrMsg);
      }
    } else {
      ret = false;
      this.gErrMsg = "Please enter your work email!";
      this.checkoutService.showErrorMsg('pbuvoucher',this.gErrMsg);
    }
    return ret;
  }

  confirmOrder(){
    const orderKey = this.checkoutService.getOrderKey();
    localStorage.setItem('rating_orderKey',orderKey);
    let grandTotal = this.totalAmount;
    // if(this.updateCoupon){
    //   this.updateGCStatus(this.updateCoupon);
    // }
    let gcArr: any = [];
    for (const key in this.gcList){
      gcArr.push(Number(this.gcList[key].code));
    }
    if(this.checkedCash){
      this.paymentType = "CASH";
    }
    let params: any = {};
    params = {
      id: this.orderId,
      specialInstructions: this.instructionsText,
      paymentTotal: this.paymentHolder,
      paymentType: this.paymentType,
      discountTotal: this.discount,
      serviceFee: this.serviceFee,
      deliveryFee: this.deliveryFee,
      adjustmentTotal: this.totalAmountDue,
      total: grandTotal,
      status: 'pending',
      gcList: gcArr,
      useraccount_id: this.userData.id,
    }

    this.checkoutService.getTimeSlotOrder(this.orderId).mergeMap(res => {
      const timeslotParams = {
        order_id: this.orderId,
        timeslot_id: this.deliveryDate.timeslotId,
        date: this.deliveryDate.date,
      };
      if(res.message){
        return this.checkoutService.setTimeSlotOrder({
          order_id: this.orderId,
          timeslot_id: this.deliveryDate.timeslotId,
          date: this.deliveryDate.date,
        });
      } else {
        return this.checkoutService.updateTimeSlotOrder({
          id: res.id,
          order_id: this.orderId,
          timeslot_id: this.deliveryDate.timeslotId,
          date: this.deliveryDate.date,
        });
      }
    }).mergeMap(response => {
      if (response.message.toUpperCase() == 'SAVED') {
        return this.checkoutService.updateOrderPayment(params).mergeMap(res => {
          if (res.message.indexOf('Processed') >= 0) {
            this.router.navigate(['/checkout', 'confirm', orderKey]);
            if (this.voucherCode) {
              return this.checkoutService.updateVoucherStatus(this.voucherCode);
            } else {
              return Observable.of(false);
              // return Observable.empty();
            }
          } else {
            let num = res.message.match(/\d+/g).map(n => parseInt(n));
            this.removeGC(num.toString());
            return Observable.of(false);
            // return Observable.empty();
          }
        })
      }
    }).subscribe();

    localStorage.removeItem('giftcert');
    localStorage.removeItem('voucher');
    localStorage.removeItem('discount');
    localStorage.removeItem('currentOrderKey');
    localStorage.removeItem('currentOrderToken');
  }

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.unsubscribe();
  }

}
