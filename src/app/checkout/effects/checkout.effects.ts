import { CartItem } from './../../core/models/cart_item';
import { CheckoutService } from './../../core/services/checkout.service';
import { CheckoutActions } from './../actions/checkout.actions';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Effect, Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';

@Injectable()
export class CheckoutEffects {

  constructor(private actions$: Actions,
  private checkoutService: CheckoutService,
  private actions: CheckoutActions) {}

  // tslint:disable-next-line:member-ordering
  @Effect()
    AddToCart$ = this.actions$
    .ofType(CheckoutActions.ADD_TO_CART)
    .switchMap((action: Action) => {
      return this.checkoutService.createNewCartItem(action.payload);
    })
    .map((cartItem: CartItem) => this.actions.addToCartSuccess(cartItem));

  @Effect()
    AddItemsToCart$ = this.actions$
    .ofType(CheckoutActions.ADD_ITEMS_TO_CART)
    .switchMap((action: Action) => {
      return this.checkoutService.createNewCartItem(action.payload);
    })
    .map((cartItem: CartItem) => this.actions.addToCartSuccess(cartItem));

  @Effect()
    UpdateCartItem$ = this.actions$
    .ofType(CheckoutActions.UPDATE_CART_ITEM)
    .switchMap((action: Action) => {
      return this.checkoutService.updateCartItem(action.payload);
    })
    .map((cartItem: CartItem) => this.actions.updateCartItemSuccess(cartItem.quantity, cartItem.id));

  }
  // @Effect()
    // FetchCurrentOrder$ = this.actions$
    // .ofType(CartActions.FETCH_CURRENT_ORDER)
    // .switchMap((action: Action) => {
    //   return this.cartService.fetchCurrentOrder();
    // })
    // .map((order: Order) => {
    //   return this.cartActions.fetchCurrentOrderSuccess(order);
    // });



  // Use this effect once angular releases RC4

  // @Effect()
  //   RemoveCartItem$ = this.actions$
  //   .ofType(CartActions.REMOVE_LINE_ITEM)
  //   .switchMap((action: Action) => {
  //     return this.cartService.deleteCartItem(action.payload);
  //   })
  //   .map(() => this.cartActions.removeCartItemSuccess());
