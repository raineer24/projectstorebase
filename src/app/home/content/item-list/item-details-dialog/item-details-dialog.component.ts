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
       this.images = [];
       this.images.push({
         source: "../../assets/ItemProd.jpg",
         thumbnail: "../../assets/ItemProd.jpg",
         title: "Sopranos 1"
       });
       this.images.push({
         source: "../../assets/ItemProd.jpg",
         thumbnail: "../../assets/ItemProd.jpg",
         title: "Sopranos 2"
       });
       this.images.push({
         source: "../../assets/ItemProd.jpg",
         thumbnail: "../../assets/ItemProd.jpg",
         title: "Sopranos 3"
       });
       
    }

  ngOnInit(
    
  ) {

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

