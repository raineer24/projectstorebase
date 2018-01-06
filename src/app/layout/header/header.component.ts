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
import { ProductService } from '../../core/services/product.service';
import { ProductActions } from '../../product/actions/product-actions';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  isAuthenticated: Observable<boolean>;
  totalCartItems: Observable<number>;
  categories$: Observable<any>;
  asyncSelected: string;
  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;
  dataSource: Observable<any>;
  searchData: Object = {};
  catList: Object = {};
  copycatList: Array<any> = [];
  copyitemList: Array<any> = [];
  catArr: Array<any> = [];

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private authActions: AuthActions,
    private productService: ProductService,
    private productActions: ProductActions,
    private searchActions: SearchActions,
    private router: Router
  ) {
    this.categories$ = this.store.select(getTaxonomies);
    this.categories$.subscribe(data => {
          this.catList = { items: data };

          for(var n=0; n < 5; n++){
            this.copycatList[n] = data[n].name;
          }
          console.log(this.copycatList);


        });
    this.dataSource = Observable.create((observer: any) => {
      // Runs on every searchBar
      if(this.asyncSelected && this.asyncSelected.length > 1) {
        observer.next(this.asyncSelected);
      }
    }).mergeMap((token: string) => this.productService.getAutoSuggestItems(token)
        .map(data => {
          this.searchData = { items: data };

          this.copyitemList = data.list;
          for(var n=0; n<5; n++){
            this.copyitemList.push(this.copycatList[n]);
          }
          console.log(this.copyitemList);
          return data.list;

        })
    )

  }

  ngOnInit() {
    // this.store.dispatch(this.authActions.authorize());
    this.isAuthenticated = this.store.select(getAuthStatus);
    this.totalCartItems = this.store.select(getTotalCartItems);
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

}
