import { environment } from './../../../../../environments/environment';
import { Item } from './../../../../core/models/item';
import { CartItem } from './../../../../core/models/cart_item';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppState } from './../../../../interfaces';
import { Store } from '@ngrx/store';
import { CheckoutActions } from './../../../../checkout/actions/checkout.actions';
import { ProductActions } from './../../../../product/actions/product-actions';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-item-list-entry',
//  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './item-list-entry.component.html',
  styleUrls: ['./item-list-entry.component.scss']
})
export class ItemListEntryComponent implements OnInit {
  @Input() item: Item;
  @Input() cartItems: CartItem[];
  @Output() onOpenModalEmit: EventEmitter<any> = new EventEmitter<any>();
  itemQuantity: number = 0;
  quantityControl = new FormControl;
  private imageRetries: number = 0;
  MIN_VALUE: number = 1;
  MAX_VALUE: number = 9999;

  constructor(
    private store: Store<AppState>,
    private checkoutActions: CheckoutActions,
    private productActions: ProductActions,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
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
          this.cdr.detectChanges();
          this.itemQuantity = value;
          let cartItem = this.getCartItem();
          cartItem.quantity = value;
          this.store.dispatch(this.checkoutActions.updateCartItem(cartItem));
        }
      })
  }

  getItemImageUrl(key) {
    var url = '';
    switch (this.imageRetries){
      case 0: {
        url = environment.IMAGE_REPO + key + '.jpg';
        break;
      }
      case 1: {
        url = 'assets/omg-01.png'
        break;
      }
      default: {
        url = 'assets/omg-01.png'
        break;
      }
    }
    return url;
  }

  private detach() {
    this.cdr.detach();
  }

  onImageLoaded() {
    this.detach();
  }

  onImageError() {
    this.imageRetries++;
  }

  addToCart(e) {
    e.stopPropagation();
    this.itemQuantity = 1;
    this.store.dispatch(this.checkoutActions.addToCart(this.item));
    this.cdr.detectChanges();
  }

  selectItem() {
    this.store.dispatch(this.productActions.addSelectedItem(this.item));
    this.onOpenModalEmit.emit(this.item);
  }

  incrementQuantity(e) {
    if(this.itemQuantity < this.MAX_VALUE) {
      this.itemQuantity++;
      this.quantityControl.setValue(this.itemQuantity);
      this.cdr.detectChanges();
    }
  }

  decrementQuantity(e) {
    if(this.itemQuantity > this.MIN_VALUE) {
      this.itemQuantity--;
      this.quantityControl.setValue(this.itemQuantity);
      this.cdr.detectChanges();
    }
  }

  inputQuantity(e) {
    e.stopPropagation();
  }

  getCartItem(){
    return this.cartItems.find(cartItem => cartItem.item_id === this.item.id);
  }

}
