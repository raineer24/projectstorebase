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
  serviceFee: number;
  deliveryFee: number;
  sFee: any;
  dFee: any;
  @Input() totalCartValue: number;
  @Input() totalCartItems: number;
  @Input() totalDiscounts: number;
  @Input() totalAmtDue: number;
  @Input() grandTotal: number;
  @ViewChild('coupon') coupon:ElementRef;
  @ViewChild('appCoupon') appCoupon:ElementRef;
  totalDiscount$: Subscription;
  grandTotalContainer: number = 0;
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
    let settings = localStorage.getItem('settings');
    settings = JSON.parse(settings);
    this.sFee = settings[0];
    this.dFee = settings[1];
    this.serviceFee = this.sFee[`value`];
    this.deliveryFee = this.dFee[`value`];
    this.grandTotalContainer = Number(this.totalCartValue) + this.serviceFee + this.deliveryFee - this.totalDiscounts;
    this.grandTotal = this.grandTotalContainer;
    this.totalAmtDue = this.grandTotalContainer;
  }

  placeOrder() {
    if (this.totalDiscounts == null) {
      this.totalDiscounts = 0;
    }
    this.checkoutService.updateOrder({
      status: 'cart',
      totalQuantity: this.totalCartItems,
      itemTotal: this.totalCartValue,
      total: this.grandTotalContainer,
      discount: this.totalDiscounts,
      adjustmentTotal: this.totalAmtDue,
    }).do(() => {
      this.router.navigate(['/checkout', 'address']);
    }).subscribe();
  }

  ngOnDestroy() {
    this.stateSub$.unsubscribe();
  }
}
