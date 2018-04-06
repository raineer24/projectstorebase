import { Router } from '@angular/router';
import { getTotalCartValue, getOrderState, getTotalCartItems, getTotalAmtDue, getTotalDiscount, getGrandTotal } from './../reducers/selectors';
import { Observable } from 'rxjs/Observable';
import { CheckoutService } from './../../core/services/checkout.service';
import { CheckoutActions } from './../actions/checkout.actions';
import { AppState } from './../../interfaces';
import { Store } from '@ngrx/store';
import { LineItem } from './../../core/models/line_item';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { getProducts, getTaxonomies } from "./../../product/reducers/selectors";
import { getAuthStatus } from '../../auth/reducers/selectors';

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

  constructor(private store: Store<AppState>) {
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
}
