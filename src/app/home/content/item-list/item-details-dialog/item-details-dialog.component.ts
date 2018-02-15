import { environment } from './../../../../../environments/environment';
import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductActions } from './../../../../product/actions/product-actions';
import { CheckoutActions } from './../../../../checkout/actions/checkout.actions';
import { CartItem } from './../../../../core/models/cart_item';
import { Item } from './../../../../core/models/item';
import { AppState } from './../../../../interfaces';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-item-details-dialog',
  templateUrl: './item-details-dialog.component.html',
  styleUrls: ['./item-details-dialog.component.scss']
})
export class ItemDetailsDialogComponent implements OnInit, OnDestroy{
  @Input() item: Item;
  @Input() cartItems: CartItem[];
  @Output() onCloseModalEmit: EventEmitter<string> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  itemQuantity: number = 0;
  quantityControl = new FormControl;
  images: any[];
  saveAmount: any;
  scrolling$: Subscription;
  MIN_VALUE: number = 1;
  MAX_VALUE: number = 9999;
  private imageRetries: number = 0;

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
        if(isNaN(value) || value < this.MIN_VALUE || value > this.MAX_VALUE){
          this.quantityControl.setValue(this.itemQuantity);
        } else {
          this.itemQuantity = value;
          let cartItem = this.getCartItem();
          cartItem.quantity = value;
          this.store.dispatch(this.checkoutActions.updateCartItem(cartItem));
        }
      })
    this.scrolling$ = Observable.fromEvent(window,'wheel')
      .map((event: any) => {
        event.preventDefault();
        event.stopPropagation();
      }).subscribe();
  }

  ngOnDestroy() {
    this.scrolling$.unsubscribe();
    this.store.dispatch(this.productActions.removeSelectedItem());
    window.history.pushState('item-slug', 'Title', '/');
  }

  hideSavings (dp, p) {
    return (dp - p !== 0);
  }

  hideListPrice(dp, p) {
    return (dp !== p);
  }

  getItemImageUrl(key) {
    let url = '';
    if(!key || this.imageRetries > 0) {
      url = 'assets/omg-01.png'
    } else {
      url = environment.IMAGE_REPO + key + '.jpg';
    }
    return url;
  }

  onImageError() {
    this.imageRetries++;
  }

  onCloseModal() {
    this.onCloseModalEmit.emit();

  }

  addToCart() {
    this.itemQuantity = 1;
    this.store.dispatch(this.checkoutActions.addToCart(this.item));
  }

  incrementQuantity() {
    if(this.itemQuantity < this.MAX_VALUE) {
      this.itemQuantity++;
      this.quantityControl.setValue(this.itemQuantity);
    }
  }

  decrementQuantity() {
    if(this.itemQuantity > this.MIN_VALUE) {
      this.itemQuantity--;
      this.quantityControl.setValue(this.itemQuantity);
    }
  }

  getCartItem(){
    return this.cartItems.find(cartItem => cartItem.item_id === this.item.id);
  }

}
