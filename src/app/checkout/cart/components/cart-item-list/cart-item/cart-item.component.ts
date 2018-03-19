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
  selector: "app-cart-item",
  templateUrl: "./cart-item.component.html",
  styleUrls: ["./cart-item.component.scss"]
})
export class CartItemComponent implements OnInit {
  image: string;
  name: string;
  quantity: number;
  amount: number;
  quantityControl = new FormControl();
  @Input() cartItem: CartItem;
  @Input() isCartSummary: boolean = false;
  MIN_VALUE: number = 1;
  MAX_VALUE: number = 9999;
  private imageRetries: number = 0;

  constructor(
    private store: Store<AppState>,
    private actions: CheckoutActions,
    private checkoutService: CheckoutService,
    private checkoutActions: CheckoutActions
  ) {}

  ngOnInit() {
    this.amount = this.cartItem.total;
    this.quantity = this.cartItem.quantity;
    this.quantityControl.valueChanges
      .debounceTime(300)
      .subscribe(value => {
        if(isNaN(value) || !Number.isInteger(value) || value < this.MIN_VALUE || value > this.MAX_VALUE){
          // do nothing;
        } else {
          this.quantity = value;
          this.cartItem.quantity = value;
          this.store.dispatch(this.checkoutActions.updateCartItem(this.cartItem));
        }
      })
  }

  getItemImageUrl(key) {
    let url = "";
    if (!key) {
      url = "assets/omg-04.png";
    } else {
      switch (this.imageRetries) {
        case 0: {
          // return environment.IMAGE_REPO + key + ".jpg";
          url = environment.IMAGE_REPO + key + ".jpg";
          break;
        }
        case 1: {
          url = "assets/omg-04.png";
          break;
        }
        default: {
          url = "assets/omg-04.png";
          break;
        }
      }
    }
    return url;
  }

  onImageError():void {
    this.imageRetries++;
  }

  // Change this method once angular releases RC4
  // Follow this linke to know more about this issue https://github.com/angular/angular/issues/12869
  removeCartItem() {
    this.store.dispatch(this.actions.removeCartItem(this.cartItem.id));
    this.checkoutService.deleteCartItem(this.cartItem).subscribe();
  }

  incrementQuantity() {
    if (this.quantity < this.MAX_VALUE) {
      this.quantity++;
      this.quantityControl.setValue(this.quantity);
    }
  }

  decrementQuantity() {
    if (this.quantity > this.MIN_VALUE) {
      this.quantity--;
      this.quantityControl.setValue(this.quantity);
    }
  }

  keyPress(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  checkIfValid(e) {
    const value = e.target.value;
    if(isNaN(value) || !Number.isInteger(value)) {
      this.quantityControl.setValue(this.quantity)
    }
    if (value < this.MIN_VALUE) {
      this.quantityControl.setValue(this.MIN_VALUE)
    }
    if (value > this.MAX_VALUE) {
      this.quantityControl.setValue(this.MAX_VALUE)
    }
  }
}
