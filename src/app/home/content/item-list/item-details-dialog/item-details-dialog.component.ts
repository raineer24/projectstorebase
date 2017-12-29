import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { ProductActions } from './../../../../product/actions/product-actions';
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

  constructor(
    private productActions: ProductActions,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
     this.store.dispatch(this.productActions.addSelectedItem(this.item))
  }

  ngOnDestroy() {

  }
}
