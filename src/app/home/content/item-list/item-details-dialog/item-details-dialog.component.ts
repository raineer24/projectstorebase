import { environment } from './../../../../../environments/environment';
import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductActions } from './../../../../product/actions/product-actions';
import { CheckoutActions } from './../../../../checkout/actions/checkout.actions';
import { CartItem } from './../../../../core/models/cart_item';
import { Item } from './../../../../core/models/item';
import { AppState } from './../../../../interfaces';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-item-details-dialog',
  templateUrl: './item-details-dialog.component.html',
  styleUrls: ['./item-details-dialog.component.scss']
})
export class ItemDetailsDialogComponent implements OnInit, OnDestroy{
  @Input() item: Item;
  @Input() cartItems: CartItem[];
  @Output() onCloseModalEmit: EventEmitter<string> = new EventEmitter();
  itemQuantity: number = 0;
  quantityControl = new FormControl;
  images: any[];
  saveAmount: any;

  constructor(
    private productActions: ProductActions,
    private checkoutActions: CheckoutActions,
    private store: Store<AppState>,
  ) {

    }

  ngOnInit(

  ) {
    this.images = [];
    this.images.push({
      source: this.getItemImageUrl(this.item.imageKey),
      thumbnail: this.getItemImageUrl(this.item.imageKey),
      title: this.item.name
    });
    this.images.push({
      source: this.getItemImageUrl(this.item.imageKey),
      thumbnail: this.getItemImageUrl(this.item.imageKey),
      title: this.item.name
    });
    this.images.push({
      source: this.getItemImageUrl(this.item.imageKey),
      thumbnail: this.getItemImageUrl(this.item.imageKey),
      title: this.item.name
    });

    const cartItem = this.getCartItem();
    if(typeof(cartItem) != "undefined"){
      this.itemQuantity = cartItem.quantity;
    }
    this.quantityControl.valueChanges
      .debounceTime(300)
      .subscribe(value => {
        if(isNaN(value) || value < 1 || value > 9999){
          this.quantityControl.setValue(this.itemQuantity);
        } else {
          this.itemQuantity = value;
          let cartItem = this.getCartItem();
          cartItem.quantity = value;
          this.store.dispatch(this.checkoutActions.updateCartItem(cartItem));
        }
      })
  }

  ngOnDestroy() {
    this.store.dispatch(this.productActions.removeSelectedItem())
  }

  hideSavings (dp, p) {
    return (dp - p !== 0);
  }

  getItemImageUrl(key) {
    return environment.IMAGE_REPO + key + '.jpg';
  }

  onCloseModal() {
    this.onCloseModalEmit.emit();
  }

  addToCart() {
    this.itemQuantity = 1;
    this.store.dispatch(this.checkoutActions.addToCart(this.item));
  }

  incrementQuantity() {
    if(this.itemQuantity < 9999) {
      this.itemQuantity++;
      this.quantityControl.setValue(this.itemQuantity);
    }
  }

  decrementQuantity() {
    if(this.itemQuantity > 1) {
      this.itemQuantity--;
      this.quantityControl.setValue(this.itemQuantity);
    }
  }

  getCartItem(){
    return this.cartItems.find(cartItem => cartItem.item_id === this.item.id);
  }

}
