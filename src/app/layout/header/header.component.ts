import { Router } from '@angular/router';
import { SearchActions } from './../../home/reducers/search.actions';
import { getTaxonomies } from './../../product/reducers/selectors';
import { getTotalCartItems } from './../../checkout/reducers/selectors';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../interfaces';
import { getAuthStatus } from '../../auth/reducers/selectors';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../core/services/auth.service';
import { AuthActions } from '../../auth/actions/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  isAuthenticated: Observable<boolean>;
  totalCartItems: Observable<number>;
  taxonomies$: Observable<any>;
  taxonList = [{
    'id': 4,
    'name': 'All Groceries',
    'children': ['shampoo', 'toothpaste', 'soap'],
    'pretty_name': 'Categories -> All',
    'permalink': 'categories/all',
    'parent_id': 1,
    'taxonomy_id': 1,
    'taxons': null},
  {
    'id': 3,
    'name': 'Meat',
    'children': ['Bacon', 'Ham', 'Hotdogs'],
    'pretty_name': 'Categories -> Meat',
    'permalink': 'categories/meat',
    'parent_id': 1,
    'taxonomy_id': 1,
    'taxons': null
  }, {
    'id': 6,
    'name': 'Fish',
    'children': ['Salmom', 'Sardines', 'Seafods'],
    'pretty_name': 'Brand -> Fish',
    'permalink': 'categories/vegetables',
    'parent_id': 1,
    'taxonomy_id': 1,
    'taxons': null
  }, {
    'id': 7,
    'name': 'Vegetables',
    'children': ['Carrots', 'Onions', 'Lettuce'],
    'pretty_name': 'Brand -> Vegetables',
    'permalink': 'categories/vegetables',
    'parent_id': 1,
    'taxonomy_id': 1,
    'taxons': null
  }, {
    'id': 8,
    'name': 'Fruits',
    'children': ['Mango', 'Banana', 'Apple'],
    'pretty_name': 'Brand -> Fruits',
    'permalink': 'categories/fruits',
    'parent_id': 1,
    'taxonomy_id': 1,
    'taxons': null
  }, {
    'id': 9,
    'name': 'Organic',
    'children': ['Tea', 'Milk', 'Fruits'],
    'pretty_name': 'Brand -> Organic',
    'permalink': 'categories/organic',
    'parent_id': 1,
    'taxonomy_id': 1,
    'taxons': null
  }//, {
  //    'id': 9,
  //   'name': 'Apache',
  //   'pretty_name': 'Brand -> Apache',
  //   'permalink': 'brand/apache',
  //   'parent_id': 2,
  //   'taxonomy_id': 2,
  //   'taxons': null
  // }, {
  //   'id': 10,
  //   'name': 'Spree',
  //   'pretty_name': 'Brand -> Spree',
  //   'permalink': 'brand/spree',
  //   'parent_id': 2,
  //   'taxonomy_id': 2,
  //   'taxons': null
  // }, {
  //   'id': 11,
  //   'name': 'Rails',
  //   'pretty_name': 'Brand -> Rails',
  //   'permalink': 'brand/rails',
  //   'parent_id': 2,
  //   'taxonomy_id': 2,
  //   'taxons': null
  // }
];
  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private authActions: AuthActions,
    private searchActions: SearchActions,
    private router: Router
  ) {
    this.taxonomies$ = this.store.select(getTaxonomies);
  }

  ngOnInit() {
    this.store.dispatch(this.authActions.authorize());
    this.isAuthenticated = this.store.select(getAuthStatus);
    this.totalCartItems = this.store.select(getTotalCartItems);
  }

  selectTaxon(taxon) {
    this.router.navigateByUrl('/');
    this.store.dispatch(this.searchActions.addFilter(taxon));
  }

}
