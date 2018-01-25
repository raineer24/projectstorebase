import { Router } from '@angular/router';
import { SearchActions } from './../../home/reducers/search.actions';
import { getTaxonomies } from './../../product/reducers/selectors';
import { getTotalCartItems } from './../../checkout/reducers/selectors';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../interfaces';
import { getAuthStatus } from '../../auth/reducers/selectors';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../core/services/auth.service';
import { AuthActions } from '../../auth/actions/auth.actions';
import { ProductService } from '../../core/services/product.service';
import { ProductActions } from '../../product/actions/product-actions';
import { Item } from '../../core/models/item';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  selectedItem: Item;
  isAuthenticated: Observable<boolean>;
  totalCartItems: Observable<number>;
  categories$: Observable<any>;
  asyncSelected: string;
  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;
  dataSource: Observable<any>;
  searchData: Object = {};
  mergeList: Object = {};
  copycatList: Object = {};
  copyitemList: Object = {};
  toTypeAhead: Array<any>;
  @ViewChild('itemDetailsModal') itemDetailsModal;

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private authActions: AuthActions,
    private productService: ProductService,
    private productActions: ProductActions,
    private searchActions: SearchActions,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {

    this.dataSource = Observable.create((observer: any) => {
      // Runs on every searchBar
      if(this.asyncSelected && this.asyncSelected.length > 1) {
        observer.next(this.asyncSelected);
      }
    }).mergeMap((token: string) => this.productService.getAutoSuggestItems(token)
        .map(data => {
          this.searchData = { items: data };
          console.log(this.searchData);
          //this.itemList = data.list;
          this.copyitemList = data.list;
          this.copycatList = data.categories;

          var itemctr = 0
          for(var key in this.copyitemList) {
            itemctr++;
            this.copyitemList[key] = Object.assign({group:'items'},this.copyitemList[key]);
          }

          itemctr = 0
          for(var key in this.copycatList) {
            itemctr++;
            this.copycatList[key] = Object.assign({group:'categories'},this.copycatList[key]);
          }

          var arrayName = [];
          itemctr = 0;
          for(var key in this.copyitemList) {
            arrayName[itemctr] = this.copyitemList[key];
            itemctr++;
          }
          for(var key in this.copycatList) {
            arrayName[itemctr] = this.copycatList[key];
            itemctr++;
          }

          return arrayName;

        })
    )

  }

  ngOnInit() {
    // this.store.dispatch(this.authActions.authorize());
    this.isAuthenticated = this.store.select(getAuthStatus);
    this.totalCartItems = this.store.select(getTotalCartItems);
    this.categories$ = this.store.select(getTaxonomies);
  }

  selectAll() {
    this.router.navigateByUrl('/');
    this.store.dispatch(this.productActions.getAllProducts())
  }

  selectCategory(category) {
    this.router.navigateByUrl('/');
    // this.store.dispatch(this.searchActions.addFilter(category));
    this.store.dispatch(this.productActions.getItemsByCategory(category))
  }

  onMenuToggle(){
    this.cd.markForCheck();
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  changeTypeaheadNoResults(e: boolean): void {
    this.typeaheadNoResults = e;
  }

  typeaheadOnSelect(e): void {
    this.asyncSelected = "";
    this.router.navigateByUrl(`/item/${e.item.code}/${e.item.slug}`);
    this.store.dispatch(this.productActions.addSelectedItem(e.item));
    console.log("typeaheadOnSelect")

  }

  searchKeyword(): void {
    this.router.navigateByUrl('/');
    this.store.dispatch(this.productActions.getItemsBySearchSuccess(this.searchData))
  }
  selectItem(item: Item) {
    this.selectedItem = item;
    console.log(item);
    this.store.dispatch(this.productActions.addSelectedItem(item));
  }

  getItemImageUrl(key) {
    return environment.IMAGE_REPO + key + '.jpg';
  }


}
