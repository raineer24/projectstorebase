import { Router } from '@angular/router';
import { getTotalCartValue, getOrderState, getTotalCartItems } from './../reducers/selectors';
import { Observable } from 'rxjs/Observable';
import { CheckoutService } from './../../core/services/checkout.service';
import { CheckoutActions } from './../actions/checkout.actions';
import { AppState } from './../../interfaces';
import { Store } from '@ngrx/store';
import { LineItem } from './../../core/models/line_item';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { getProducts, getTaxonomies } from "./../../product/reducers/selectors";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  products$: Observable<any>;
  //totalCartValue$: Observable<number>;
  totalCartItems$: Observable<number>;

  constructor(private store: Store<AppState>) {
    //this.totalCartValue$ = this.store.select(getTotalCartValue);
    this.totalCartItems$ = this.store.select(getTotalCartItems);
   
  }

  ngOnInit() {
    this.products$ = this.store.select(getProducts);
  }

  val1: number = 1;
}
