import { getSelectedTaxonIds } from './../../reducers/selectors';
import { Observable } from 'rxjs/Observable';
import { CheckoutService } from './../../../core/services/checkout.service';
import { CheckoutActions } from './../../../checkout/actions/checkout.actions';
import { AppState } from './../../../interfaces';
import { Store } from '@ngrx/store';
// import { Product } from './../../../core/models/product';
import { Item } from './../../../core/models/item';
import { environment } from './../../../../environments/environment';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  @Input() items;
  @Input('taxonIds') selectedTaxonIds;
  @Input() toggleLayout;

  constructor(
    private checkoutService: CheckoutService,
    private store: Store<AppState>,
    private checkoutActions: CheckoutActions) { }

  ngOnInit() { }

  getItemImageUrl(url) {
    return environment.API_ENDPOINT + url;
  }

  addToCart(item: Item) {
    const variant_id = item.id;
    this.store.dispatch(this.checkoutActions.addToCart(variant_id));
  }

  getMargin() {
    return this.toggleLayout.size === 'COZY' ? '0 15px 20px 0' : '0 80px 20px 0';
  }

}
