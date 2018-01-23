import { getCartItems } from './../../../reducers/selectors';
import { CheckoutActions } from './../../../actions/checkout.actions';
import { AppState } from './../../../../interfaces';
import { Store } from '@ngrx/store';
import { CartItem } from './../../../../core/models/cart_item';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-item-list',
  templateUrl: './cart-item-list.component.html',
  styleUrls: ['./cart-item-list.component.scss']
})
export class CartItemListComponent implements OnInit {

  cartItems$: Observable<CartItem[]>;

  constructor(private store: Store<AppState>, private actions: CheckoutActions) {
    this.cartItems$ = this.store.select(getCartItems);
   }

  ngOnInit() {
  }

}
