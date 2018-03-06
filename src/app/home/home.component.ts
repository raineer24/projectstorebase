import { Component, OnInit, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from './../interfaces';
import { environment } from './../../environments/environment';
import { getFilters, getSortSettings } from './reducers/selectors';
import { Item } from './../core/models/item';
import { ProductActions } from './../product/actions/product-actions';
import { getSelectedItem } from './../product/reducers/selectors'
import { getProducts, getTaxonomies } from './../product/reducers/selectors';
import { getCartItems } from './../checkout/reducers/selectors';



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
          [products]="products$ | async"
          [cartItemsArr]="cartItems$ | async"
          [filters]="filters$ | async"
          [sorting]="sorting$ | async" >
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
  filters$: Observable<any>;
  sorting$: Observable<any>;

  constructor(
    private store: Store<AppState>
  ) {
    this.cartItems$ = this.store.select(getCartItems)
    this.products$ = this.store.select(getProducts);
    this.taxonomies$ = this.store.select(getTaxonomies);
    this.filters$ = this.store.select(getFilters);
    this.sorting$ = this.store.select(getSortSettings);
  }

  ngOnInit() {

  }

}
