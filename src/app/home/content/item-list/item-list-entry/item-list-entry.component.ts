import { environment } from './../../../../../environments/environment';
import { Item } from './../../../../core/models/item';
import { CartItem } from './../../../../core/models/cart_item';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() onOpenModalEmit: EventEmitter<string> = new EventEmitter();

  // @Input() product: Product;

  constructor(
    private store: Store<AppState>,
    private checkoutActions: CheckoutActions,
    private productActions: ProductActions,
  ) { }

  ngOnInit() {
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
    this.onOpenModalEmit.emit();
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
//    const inputQuantity = this.elRef.nativeElement.querySelector(`#item-list-quantity-${item.id}`);
//    console.log(inputQuantity.value)
//    inputQuantity.value++;
    // this.store.dispatch(this.checkoutActions.changeCartItemQuantity(item.id, 1));
  }

  decrementQuantity(item: Item, e) {
    e.stopPropagation();
    // const inputQuantity = this.elRef.nativeElement.querySelector(`#item-list-quantity-${item.id}`);
    // inputQuantity.value--;
    //this.store.dispatch(changeCartItemQuantity(inputQuantity,item.id)
  }

  inputQuantity(item: Item, e) {
    e.stopPropagation();
  //
  }

}
