import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProductActions } from './../../../../product/actions/product-actions';
import { CheckoutActions } from './../../../../checkout/actions/checkout.actions';
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
  @Output() onCloseModalEmit: EventEmitter<string> = new EventEmitter();

  images: any[];

  constructor(
    private productActions: ProductActions,
    private checkoutActions: CheckoutActions,
    private store: Store<AppState>
  ) {

    }

  ngOnInit(

  ) {
    this.images = [];
    this.images.push({
      source: `https://s3-ap-southeast-2.amazonaws.com/grocerymegan62201/gorcery/${this.item.imageKey}.jpg`,
      thumbnail: `https://s3-ap-southeast-2.amazonaws.com/grocerymegan62201/gorcery/${this.item.imageKey}.jpg`,
      title: this.item.name
    });
    this.images.push({
      source: `https://s3-ap-southeast-2.amazonaws.com/grocerymegan62201/gorcery/${this.item.imageKey}.jpg`,
      thumbnail: `https://s3-ap-southeast-2.amazonaws.com/grocerymegan62201/gorcery/${this.item.imageKey}.jpg`,
      title: this.item.name
    });
    this.images.push({
      source: `https://s3-ap-southeast-2.amazonaws.com/grocerymegan62201/gorcery/${this.item.imageKey}.jpg`,
      thumbnail: `https://s3-ap-southeast-2.amazonaws.com/grocerymegan62201/gorcery/${this.item.imageKey}.jpg`,
      title: this.item.name
    });
    // console.log(this.item);
  }

  ngOnDestroy() {
    this.store.dispatch(this.productActions.removeSelectedItem())
  }

  onCloseModal() {
    this.onCloseModalEmit.emit();
  }

  addToCart() {
    this.store.dispatch(this.checkoutActions.addToCart(this.item));
  }


}
