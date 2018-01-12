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
  catList: Object = {};
  mergedList: Object = {};
  copycatList: Array<any> = [];
  copyitemList: Array<any> = [];
  itemList: Object = {};
  catArr: Array<any> = [];
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

    this.categories$ = this.store.select(getTaxonomies);
    this.categories$.subscribe(data => {
          this.catList = { categories: data };
          for(var i=0, len = data.length; i < len; i++){
            this.copycatList[i] = data[i];
          }
          console.log(this.catList);
        });
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
          //this.mergedList = Object.assign(this.itemList,this.catList);
          //console.log(JSON.stringify(this.mergedList));
          for(var i=0, len=this.copyitemList.length; i < len; i++){
             this.copyitemList.push(this.copycatList[i]);
          }

          var group_to_values = this.copyitemList.reduce(function (obj, item) {
              if(item.brandName !== undefined){
                 obj[item.name] = 'items';
              }else{
                 obj[item.name] = 'categories';
              }
              return obj;
          }, {});

          var groupings = Object.keys(group_to_values).map(function (key) {
              return {group: group_to_values[key], name:key };
          });

          for (var i = 0, len = groups.length; i < len; i++) {
            groupings[i]["id"] = this.copyitemList[i].id;
            if(groupings[i].group === 'items') {
              groupings[i]["price"] = this.copyitemList[i].displayPrice;
            }

            //console.log(groups[i]);
          }

          return groupins;

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

  // autoComplete(event){
  //   const text = event.target.value;
  //   if(text.length > 1) {
  //     console.log(event.target.value);
  //   }
  // }
  //
  // getStatesAsObservable(token: string): Observable<any> {
  //   let query = new RegExp(token, 'ig');
  //
  //   return Observable.of(
  //     this.statesComplex.filter((state: any) => {
  //       return query.test(state.name);
  //     })
  //   );
  // }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  changeTypeaheadNoResults(e: boolean): void {
    this.typeaheadNoResults = e;
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    this.router.navigateByUrl(`/item/item-details/${e.item.id}`);
    //this.router.navigate(['user/profile']);
  }

  searchKeyword(): void {
    this.router.navigateByUrl('/');
    this.store.dispatch(this.productActions.getItemsBySearchSuccess(this.searchData))
  }
  selectItem(item: Item) {
    this.selectedItem = item;
    this.store.dispatch(this.productActions.addSelectedItem(item));
    this.itemDetailsModal.open();
  }

}
