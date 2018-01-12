import { CheckoutService } from './../../../../../core/services/checkout.service';
import { CheckoutActions } from './../../../../actions/checkout.actions';
import { AppState } from './../../../../../interfaces';
import { Store } from '@ngrx/store';
import { environment } from './../../../../../../environments/environment';
import { CartItem } from './../../../../../core/models/cart_item';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent implements OnInit {

  image: string;
  name: string;
  quantity: number;
  amount: number;
  quantityValue: number;
  description: string;

  @Input() cartItem: CartItem;

  constructor(
    private store: Store<AppState>,
    private actions: CheckoutActions,
    private checkoutService: CheckoutService)
  { }

  ngOnInit() {
    // this.image = environment.API_ENDPOINT + this.cartItem.variant.images[0].product_url;
  //  this.name = this.cartItem.item.name;
    this.quantityValue = this.cartItem.quantity;
    this.amount = this.cartItem.total;
    this.description = this.cartItem.description;
  }

  // Change this method once angular releases RC4
  // Follow this linke to know more about this issue https://github.com/angular/angular/issues/12869
  removeCartItem() {
    // this.store.dispatch(this.actions.removeCartItem(this.cartItem.id));
    // this.checkoutService.deleteCartItem(this.cartItem)
    //   .subscribe();
  }
}
