import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppState } from './../../interfaces';
import { CheckoutActions } from './../actions/checkout.actions';
import { getTotalCartValue, getOrderState, getTotalCartItems,
  getTotalAmtDue, getTotalDiscount, getGrandTotal } from './../reducers/selectors';
import { getAuthStatus } from './../../auth/reducers/selectors';
import { CheckoutService } from './../../core/services/checkout.service';
import { LineItem } from './../../core/models/line_item';
import { getProducts, getTaxonomies } from "./../../product/reducers/selectors";


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  totalCartValue$: Observable<number>;
  totalCartItems$: Observable<number>;
  totalAmtDue$: Observable<number>;
  totalDiscount$: Observable<number>;
  grandTotal$: Observable<number>;
  isAuthenticated$: Observable<boolean>;
  @ViewChild('confirmModal') confirmModal;


  constructor(
    private store: Store<AppState>,
    private checkoutActions: CheckoutActions,
    private checkoutService: CheckoutService,
  ) {
    this.totalCartValue$ = this.store.select(getTotalCartValue);
    this.totalCartItems$ = this.store.select(getTotalCartItems);
    this.totalAmtDue$ = this.store.select(getTotalAmtDue);
    this.grandTotal$ = this.store.select(getGrandTotal);
    // this.totalDiscount$ = this.store.select(getTotalDiscount);
    this.isAuthenticated$ = this.store.select(getAuthStatus);
  }

  ngOnInit() {
    // this.products$ = this.store.select(getProducts);
  }

  clearCart() {
    this.store.dispatch(this.checkoutActions.removeCartItems());
    this.checkoutService.deleteCartItems().subscribe();
    this.confirmModal.hide();
  }
}
