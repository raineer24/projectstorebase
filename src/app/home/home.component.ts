import { getSelectedTaxonIds } from './reducers/selectors';
import { getSelectedProduct } from './../product/reducers/selectors';
import { Item } from './../core/models/item';
import { Taxonomy } from './../core/models/taxonomy';
import { environment } from './../../environments/environment';
import { ProductActions } from './../product/actions/product-actions';
import { AppState } from './../interfaces';
import { getProducts, getTaxonomies } from './../product/reducers/selectors';
import { getCartItems } from './../checkout/reducers/selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <app-banner></app-banner>
    <div class="col-xs-12 home-container">
      <!--
      <div class="col-xs-3">
        <app-taxons [taxonomies]="taxonomies$ | async"></app-taxons>
      </div>
      <div class="col-xs-9">
      -->

        <app-content
          [products]="products$ | async" [cartItemsArr]="cartItems$ | async">
          <!-- [taxonIds]="selectedTaxonIds$ | async"> -->
        </app-content>

    </div>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products$: Observable<any>;
  taxonomies$: Observable<any>;
  cartItems$: Observable<any>;

  constructor(
    private store: Store<AppState>
  ) {
    this.cartItems$ = this.store.select(getCartItems)
    this.products$ = this.store.select(getProducts);
    this.taxonomies$ = this.store.select(getTaxonomies);
  }

  ngOnInit() {

  }

}
