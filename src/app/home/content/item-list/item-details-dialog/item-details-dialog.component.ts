import { environment } from './../../../../../environments/environment';
import { Component, OnDestroy, OnInit, Input, Output,
  EventEmitter  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductActions } from './../../../../product/actions/product-actions';
import { CheckoutActions } from './../../../../checkout/actions/checkout.actions';
import { UserActions } from './../../../../user/actions/user.actions';
import { UserService } from './../../../../user/services/user.service';
import { CartItem } from './../../../../core/models/cart_item';
import { Item } from './../../../../core/models/item';
import { AppState } from './../../../../interfaces';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'app-item-details-dialog',
  templateUrl: './item-details-dialog.component.html',
  styleUrls: ['./item-details-dialog.component.scss']
})
export class ItemDetailsDialogComponent implements OnInit, OnDestroy{
  @Input() item: Item;
  @Input() cartItems: CartItem[];
  @Input() isAuthenticated: boolean;
  @Input() userLists: any;
  @Output() onCloseModalEmit: EventEmitter<string> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  itemQuantity: number = 0;
  quantityControl = new FormControl;
  images: any[];
  saveAmount: any;
  scrolling$: Subscription;
  isCreateList: boolean = false;
  MIN_VALUE: number = 1;
  MAX_VALUE: number = 9999;
  inputNewList = new FormControl;
  private imageRetries: number = 0;
  private componentDestroyed: Subject<any> = new Subject();

  constructor(
    private productActions: ProductActions,
    private checkoutActions: CheckoutActions,
    private userActions: UserActions,
    private userService: UserService,
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

      // TODO:  reset checkbox state
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

  toggleCreateNewList(): void {
    this.isCreateList = true;
  }

  selectList(index: number, id: number) {
    // console.log(this.checkbox[index])
    // this.checkbox[index].checked != this.checkbox[index].checked;
    let state; console.log(this.userLists)
    if(this.userLists[index].state == 'undefined') {
      this.userLists[index].state = true;
      state = true;
    } else {
      state = !this.userLists[index].state;
      this.userLists[index].state = state;
    }
    if(state) {
      const listitem = {
        list_id: id,
        item_id: this.item.id
      }
      this.userService.addListItem(listitem).takeUntil(this.componentDestroyed).subscribe(res => {
        console.log(res.message)
        if(res.message == 'Saved') {
        } else {
        }
      })
    } else {
      // TODO: implement delete
      // this.userService.removeListItem(this.id).takeUntil(this.componentDestroyed).subscribe(res => {
      //   if(res.message == 'Deleted') {
      //   } else {
      //   }
      // })
    }
  }

  addToList(id: number,index: number): void {
    // if(event.target.checked) {
    //   //let checkbox = this.listCheckBox.toArray()[index];
    //   const listitem = {
    //     list_id: id,
    //     item_id: this.item.id
    //   }
    //   this.userService.addListItem(listitem).takeUntil(this.componentDestroyed).subscribe(res => {
    //     if(res.message == 'Saved') {
    //     }
    //   })
    // }
    // else {
    //   this.userService.removeListItem(this.id).takeUntil(this.componentDestroyed).subscribe(res => {
    //     if(res.message == 'Deleted') {
    //     } else {
    //
    //   }
    //   })
    // }
  }

  createNewList(): void{
    if(this.inputNewList.value) {
      const params = {
        name: this.inputNewList.value,
        description: ''
      }
      this.store.dispatch(this.userActions.createUserList(params));
      this.inputNewList.setValue('');
      this.isCreateList = false;
    }
  }

  ngOnDestroy() {
    this.scrolling$.unsubscribe();
    this.store.dispatch(this.productActions.removeSelectedItem());
    window.history.pushState('item-slug', 'Title', '/');
    this.componentDestroyed.next();
    this.componentDestroyed.unsubscribe();
  }

}
