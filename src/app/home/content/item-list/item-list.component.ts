import { getSelectedTaxonIds } from './../../reducers/selectors';
import { Observable } from 'rxjs/Observable';
import { CheckoutService } from './../../../core/services/checkout.service';
import { CheckoutActions } from './../../../checkout/actions/checkout.actions';
import { ProductActions } from './../../../product/actions/product-actions';
import { getSelectedProduct } from './../../../product/reducers/selectors';
import { AppState } from './../../../interfaces';
import { Store } from '@ngrx/store';
// import { Product } from './../../../core/models/product';
import { Item } from './../../../core/models/item';
import { environment } from './../../../../environments/environment';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

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
//  selectedItem: Item;

  constructor(
    private productActions: ProductActions,
    private checkoutService: CheckoutService,
    private elRef: ElementRef,
    private store: Store<AppState>,
    private checkoutActions: CheckoutActions) { }

  ngOnInit() {
    this.selectedItem$ = this.store.select(getSelectedProduct);
  }

  getMargin() {
    return this.toggleLayout.size === 'COZY' ? '0 15px 20px 0' : '0 80px 20px 0';
  }

  getItemImageUrl(url) {
    return `https://loremflickr.com/g/180/240/grocery/all?${url}`;
    // return environment.API_ENDPOINT + url;
  }

  openItemDialog() {
    this.itemDetailsModal.open();
  }

  closeItemDialog() {
    this.itemDetailsModal.close();
  }

}
