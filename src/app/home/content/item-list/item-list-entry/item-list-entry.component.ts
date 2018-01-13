import { environment } from './../../../../../environments/environment';
import { Item } from './../../../../core/models/item';
import { CartItem } from './../../../../core/models/cart_item';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppState } from './../../../../interfaces';
import { Store } from '@ngrx/store';
import { CheckoutActions } from './../../../../checkout/actions/checkout.actions';
import { ProductActions } from './../../../../product/actions/product-actions';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-item-list-entry',
  templateUrl: './item-list-entry.component.html',
  styleUrls: ['./item-list-entry.component.scss']
})
export class ItemListEntryComponent implements OnInit {
  @Input() item: Item;
  @Input() cartItems: CartItem[];
  @Output() onOpenModalEmit: EventEmitter<any> = new EventEmitter<any>();
  itemQuantity: number = 0;
  quantityControl = new FormControl;

  constructor(
    private store: Store<AppState>,
    private checkoutActions: CheckoutActions,
    private productActions: ProductActions,
  ) { }

  ngOnInit() {
    const cartItem = this.getCartItem();
    if(typeof(cartItem) != "undefined"){
      this.itemQuantity = cartItem.quantity;
    }
    this.quantityControl.valueChanges
      .debounceTime(300)
      .subscribe(value => {
        console.log(isNaN(value)+" " + value+" "+this.itemQuantity)
        if(isNaN(value) || value < 0){
          this.quantityControl.setValue(this.itemQuantity);
        } else {
          this.itemQuantity = value;
          const cartItem = this.getCartItem();
          this.store.dispatch(this.checkoutActions.changeCartItemQuantity(this.itemQuantity, cartItem.id));
        }
      })
  }

  getProductImageUrl(url) {
    // return environment.API_ENDPOINT + url;
    return `https://angularspree-new.herokuapp.com/${url}`;
  }

  addToCart(e) {
    e.stopPropagation();
    this.itemQuantity = 1;
    this.store.dispatch(this.checkoutActions.addToCart(this.item));
  }

  selectItem() {
    this.store.dispatch(this.productActions.addSelectedItem(this.item));
    this.onOpenModalEmit.emit(this.item);
  }

  incrementQuantity(e) {
    e.stopPropagation();
    this.itemQuantity++;
    this.quantityControl.setValue(this.itemQuantity);
  }

  decrementQuantity(e) {
    e.stopPropagation();
    if(this.itemQuantity > 1) {
      this.itemQuantity--;
      this.quantityControl.setValue(this.itemQuantity);
    }
  }

  inputQuantity(e) {
    e.stopPropagation();
  }

  getCartItem(){
    return this.cartItems.find(cartItem => cartItem.item_id === this.item.id);
  }

}
