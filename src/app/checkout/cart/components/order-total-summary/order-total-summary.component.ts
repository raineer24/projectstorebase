import { getOrderState } from './../../../reducers/selectors';
import { Router } from '@angular/router';
import { CheckoutService } from './../../../../core/services/checkout.service';
import { CheckoutActions } from './../../../actions/checkout.actions';
import { AppState } from './../../../../interfaces';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, Renderer } from '@angular/core';

@Component({
  selector: 'app-order-total-summary',
  templateUrl: './order-total-summary.component.html',
  styleUrls: ['./order-total-summary.component.scss']
})
export class OrderTotalSummaryComponent implements OnInit, OnDestroy {

  stateSub$: Subscription;
  orderStatus: string;
  serviceFee: number = 100.00;
  deliveryFee: number = 100.00
  @Input() totalCartValue: number;
  @Input() totalCartItems: number;
  @Input() discount: number = 0;
  @Input() totalAmtDue: number;
  @ViewChild('coupon') coupon:ElementRef;
  @ViewChild('appCoupon') appCoupon:ElementRef;
  totalDiscount$: Subscription;
  forCoupon: any;
  errMsg: string;
  isShowErrMsg: boolean = false;


  constructor(private store: Store<AppState>,
    private actions: CheckoutActions,
    private checkoutService: CheckoutService,
    private router: Router) {
    this.stateSub$ = this.store.select(getOrderState).subscribe(state => this.orderStatus = state);
  }

  ngOnInit() {
    // this.totalAmtDue = this.totalCartValue - this.serviceFee - this.deliveryFee;
  }

  applyCoupon(coupon){
    console.log(this.coupon.nativeElement.value);
    if(this.coupon.nativeElement.value != ''){
          this.totalDiscount$ = this.checkoutService.getvoucher(this.coupon.nativeElement.value).subscribe(data => {
            if(data.message != null) {
              console.log('ERROR');
              this.errMsg = data.message;
              return this.totalCartValue;
            } else if (data.status == "used") {
              console.log('ERROR');
              this.errMsg = "Already used!";
              return this.totalCartValue;
            }
            else {
              console.log(data.discount);
              this.errMsg = null;
              this.coupon.nativeElement.value = '';
              this.discount = data.discount;
              this.totalAmtDue = this.totalCartValue - this.discount;
              console.log(this.totalAmtDue);
              //this.totalCartValue = this.totalCartValue - Number(data.discount);
              this.forCoupon = {
                value: Number(data.discount),
                amtDue: this.totalAmtDue
              };
              // this.renderer.setElementAttribute(this.appCoupon.nativeElement, 'disabled', 'true');
              this.coupon.nativeElement.value = '';
              this.appCoupon.nativeElement.disabled = true;
              this.store.dispatch(this.actions.applyCoupon(this.forCoupon));
              console.log(this.totalCartValue);
              return this.totalCartValue;

            }
          })

        } else {
          this.isShowErrMsg = true;
        }
  }

  placeOrder() {

    // if (this.orderStatus === 'cart') {
      this.checkoutService.updateOrder({
        'status': 'cart',
        'totalQuantity': this.totalCartItems,
        'itemTotal': this.totalCartValue,
        'discount':this.discount,
        'totalAmountDue': this.totalAmtDue
        }).do(() => {
          this.router.navigate(['/checkout', 'address']);
        })
        .subscribe();
    // } else {
    //   this.checkoutService.updateOrder({
    //     'status': 'cart'
    //     'totalQuantity': this.totalCartItems,
    //     'total': this.totalCartValue
    //   }, 'cart')
    //     .do(() => {
    //       this.router.navigate(['/checkout', 'address']);
    //     })
    //     .subscribe();
    // }
  }

  ngOnDestroy() {
    this.stateSub$.unsubscribe();
  }
}
