import { Observable } from 'rxjs/Observable';
import { getSelectedProduct } from './../../../product/reducers/selectors';
import { AppState } from './../../../interfaces';
import { Store } from '@ngrx/store';
import { Item } from './../../../core/models/item';
import { environment } from './../../../../environments/environment';
import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  @Input() items;
  @Input('taxonIds') selectedTaxonIds;
  @Input() toggleLayout;
  @Input() cartItems;
  @ViewChild('itemDetailsModal') itemDetailsModal;
  selectedItem$: Observable<any>;
  selectedItem: Item;

  constructor(private store: Store<AppState>) {    
  }


  ngOnInit() {
    this.selectedItem$ = this.store.select(getSelectedProduct);
  }

  getMargin() {
    return this.toggleLayout.size === 'COZY' ? '0 15px 20px 0' : '0 80px 20px 0';
  }

  openItemDialog(item: Item) {
    this.selectedItem = item;
    this.itemDetailsModal.open();
  }

  closeItemDialog() {
    this.itemDetailsModal.close();
  }

}
