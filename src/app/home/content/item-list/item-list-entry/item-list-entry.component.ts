import { environment } from './../../../../../environments/environment';
import { Item } from './../../../../core/models/item';
import { CartItem } from './../../../../core/models/cart_item';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AppState } from './../../../../interfaces';
import { Store } from '@ngrx/store';
import { CheckoutActions } from './../../../../checkout/actions/checkout.actions';
import { ProductActions } from './../../../../product/actions/product-actions';

@Component({
  selector: 'app-item-list-entry',
  templateUrl: './item-list-entry.component.html',
  styleUrls: ['./item-list-entry.component.scss']
})
export class ItemListEntryComponent implements OnInit {
  @Input() item: Item;
  @Input() cartItems: CartItem[];
  @Output() onOpenModalEmit: EventEmitter<any> = new EventEmitter<any>();
  itemQuantity: number;
//  @ViewChild('itemQuantity') itemQuantity;

  // @Input() product: Product;

  constructor(
    private store: Store<AppState>,
    private checkoutActions: CheckoutActions,
    private productActions: ProductActions,
  ) { }

  ngOnInit() {
    this.itemQuantity = 1;
  }

  getProductImageUrl(url) {
    // return environment.API_ENDPOINT + url;
    return `https://angularspree-new.herokuapp.com/${url}`;
  }

  addToCart(item: Item, e) {
    e.stopPropagation();
    this.store.dispatch(this.checkoutActions.addToCart(item));
  }

  selectItem(item: Item) {
    this.store.dispatch(this.productActions.addSelectedItem(item));
    this.onOpenModalEmit.emit(item);
  }

  isInCart(id: number) {
    const cartItem = this.cartItems.find(item => item.item_id === id);
    if(typeof(cartItem) != "undefined"){
      return cartItem.quantity;
    } else {
      return 0;
    }
  }

  incrementQuantity(item: Item, e) {
    e.stopPropagation();
    this.itemQuantity++;
//    const inputQuantity = this.elRef.nativeElement.querySelector(`#item-list-quantity-${item.id}`);
//    console.log(inputQuantity.value)
//    inputQuantity.value++;
    const cartItem = this.cartItems.find(cartItem => cartItem.item_id === item.id);
    this.store.dispatch(this.checkoutActions.changeCartItemQuantity(this.itemQuantity, cartItem.id));
  }

  decrementQuantity(item: Item, e) {
    e.stopPropagation();
    if(this.itemQuantity > 1) {
      this.itemQuantity--;
      const cartItem = this.cartItems.find(cartItem => cartItem.item_id === item.id);
      this.store.dispatch(this.checkoutActions.changeCartItemQuantity(this.itemQuantity, cartItem.id));
    }  
    // const inputQuantity = this.elRef.nativeElement.querySelector(`#item-list-quantity-${item.id}`);
    // inputQuantity.value--;
    //this.store.dispatch(changeCartItemQuantity(inputQuantity,item.id)
  }

  inputQuantity(item: Item, e) {
    e.stopPropagation();
  //
  }

}
