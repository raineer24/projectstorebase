import { Router } from '@angular/router';
import { SearchActions } from './../../home/reducers/search.actions';
import { getTaxonomies } from './../../product/reducers/selectors';
import { getTotalCartItems } from './../../checkout/reducers/selectors';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef,
  ViewChild, ViewChildren, QueryList, Input } from '@angular/core';
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
  @Input() currentStep: string;
  @Input() isHomeRoute: boolean;
  selectedItem: Item;
  isAuthenticated: Observable<boolean>;
  totalCartItems: Observable<number>;
  categories$: Observable<any>;
  asyncSelected: string;
  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;
  dataSource: Observable<any>;
  searchData: Object = {};
  copycatList: Object = {};
  copyitemList: Object = {};
  menuDelay: {'show': Array<any>, 'hide': Array<any>, 'clicked': Array<any>} = {show:[], hide:[], clicked: []};
  @ViewChild('itemDetailsModal') itemDetailsModal;
  @ViewChildren("dpmenu") dpmenus: QueryList<any>;

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
          // console.log(this.searchData);
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
    this.menuDelay.clicked[0] = true;
    this.router.navigateByUrl('/');
    this.store.dispatch(this.searchActions.setFilter({
      filters: [],
      categoryIds: []
    }));
    this.store.dispatch(this.productActions.getAllProducts());
  }

  selectCategory(category: any, index: number): void {
    this.menuDelay.clicked[index] = true;
    this.router.navigateByUrl('/');
    if(category == 'all') {
      this.store.dispatch(this.searchActions.setFilter({
        filters: [],
        categoryIds: []
      }));
      this.store.dispatch(this.productActions.getAllProducts());
    } else {
      this.store.dispatch(this.searchActions.setFilter({
        filters: [{
          mode: 'category',
          level: category.level,
          categoryId: category.id
        }],
        categoryIds: []
      }));
      this.store.dispatch(this.productActions.getItemsByCategory(category));
    }
  }

  searchKeyword(): void {
    this.router.navigateByUrl('/');
    this.store.dispatch(this.searchActions.setFilter({
      filters: [{
        mode: 'search',
        keyword: this.asyncSelected
      }],
      categoryIds: []
    }));
    if(this.asyncSelected.length > 1)
      this.store.dispatch(this.productActions.getItemsByKeyword(this.asyncSelected));
  }

  onMenuToggle(): void{
    this.cd.markForCheck();
  }

  onMenuOver(e: any, index: number): void{
    e.stopPropagation();
    if(!this.menuDelay.clicked[index]) {
      const dpmenu = this.dpmenus.toArray()[index];
      const prev = this.dpmenus.find(data => data.isOpen);
      if(!prev) {
        this.menuDelay.show[index] = setTimeout(() => {
          dpmenu.show();
        }, 200)
      } else {
        clearTimeout(this.menuDelay.hide[index]);
        prev.hide();
        dpmenu.show();
      }
    }
  }

  onMenuLeave(e: any, index: number): void{
    e.stopPropagation();
    const dpmenu = this.dpmenus.toArray()[index];
    clearTimeout(this.menuDelay.show[index]);
    this.menuDelay.hide[index] = setTimeout(() => {
      dpmenu.hide();
    }, 50);
    this.menuDelay.clicked[index] = false;
  }

  onSubMenuOver(e: any, index: number): void{
    e.stopPropagation();
    clearTimeout(this.menuDelay.hide[index]);
  }

  onSubMenuLeave(e: any, index: number): void{
    e.stopPropagation();
    const dpmenu = this.dpmenus.toArray()[index];
    this.menuDelay.hide[index] = setTimeout(() => {
      dpmenu.hide();
    }, 50);
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  changeTypeaheadNoResults(e: boolean): void {
    this.typeaheadNoResults = e;
  }

  typeaheadOnSelect(e): void {
    this.asyncSelected = e.item.name;
    this.store.dispatch(this.productActions.addSelectedItem(e.item));
    this.router.navigateByUrl(`/item/${e.item.id}/${e.item.slug}`);
  }

  selectItem(item: Item): void {
    this.selectedItem = item;
    this.store.dispatch(this.productActions.addSelectedItem(item));
  }

  getItemImageUrl(key): string {
    return environment.IMAGE_REPO + key + '.jpg';
  }


}
