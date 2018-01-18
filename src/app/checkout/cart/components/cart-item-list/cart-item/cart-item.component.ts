import { CheckoutService } from './../../../../../core/services/checkout.service';
import { CheckoutActions } from './../../../../actions/checkout.actions';
import { AppState } from './../../../../../interfaces';
import { Store } from '@ngrx/store';
import { environment } from './../../../../../../environments/environment';
import { CartItem } from './../../../../../core/models/cart_item';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

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
  quantityControl = new FormControl;
  @Input() cartItem: CartItem;

  constructor(
    private store: Store<AppState>,
    private actions: CheckoutActions,
    private checkoutService: CheckoutService,
    private checkoutActions: CheckoutActions)
  { }

  ngOnInit() {
    // this.image = environment.API_ENDPOINT + this.cartItem.variant.images[0].product_url;
  //  this.name = this.cartItem.item.name;

    this.amount = this.cartItem.total;
    this.quantity = this.cartItem.quantity;
    this.quantityControl.valueChanges
      .debounceTime(300)
      .subscribe(value => {
        if(isNaN(value) || value < 1){
          this.quantityControl.setValue(this.quantity);
        } else {
          this.quantity = value;
          this.cartItem.quantity = value;
          this.store.dispatch(this.checkoutActions.updateCartItem(this.cartItem));
        }
      })
  }

  getItemImageUrl(key) {
    return environment.IMAGE_REPO + key + '.jpg';
  }

  // Change this method once angular releases RC4
  // Follow this linke to know more about this issue https://github.com/angular/angular/issues/12869
  removeCartItem() {
    // this.store.dispatch(this.actions.removeCartItem(this.cartItem.id));
    // this.checkoutService.deleteCartItem(this.cartItem)
    //   .subscribe();
  }

  incrementQuantity() {
    this.quantity++;
    this.quantityControl.setValue(this.quantity);
  }

  decrementQuantity() {
    if(this.quantity > 1) {
      this.quantity--;
      this.quantityControl.setValue(this.quantity);
    }
  }

}
