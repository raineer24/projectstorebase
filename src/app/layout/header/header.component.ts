import { Router } from '@angular/router';
import { SearchActions } from './../../home/reducers/search.actions';
import { getTaxonomies } from './../../product/reducers/selectors';
import { getTotalCartValue, getTotalCartItems } from './../../checkout/reducers/selectors';
import { getSortSettings } from './../../home/reducers/selectors';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef,
  ViewChild, ViewChildren, QueryList, Input, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../interfaces';
import { getAuthStatus } from '../../auth/reducers/selectors';
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../../core/services/auth.service';
import { AuthActions } from '../../auth/actions/auth.actions';
import { ProductService } from '../../core/services/product.service';
import { ProductActions } from '../../product/actions/product-actions';
import { Item } from '../../core/models/item';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Subscription } from "rxjs";
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  public shouldShow =true;
  mobile: boolean = false;
  @Input() currentStep: string;
  @Input() isHomeRoute: boolean;
  @ViewChild('searchbox') searchInput:ElementRef;
  categories: Array<any>;
  selectedItem: Item;
  isAuthenticated: Observable<boolean>;
  totalCartItems: Observable<number>;
  totalCartValue: Observable<number>;
  categories$: Observable<any>;
  timer: Observable<any>;
  subscription: Subscription;
  asyncSelected: string;
  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;
  bShowProgress: boolean;
  dataSource: Observable<any>;
  searchData: Object = {};
  sortSettings: any;
  sortSubs: Subscription;
  show: boolean = false;
  catSubs: Subscription;
  inputString: string;
  // menuDelay: {'show': Array<any>, 'hide': Array<any>, 'clicked': Array<any>} = {show:[], hide:[], clicked: []};
  // @ViewChildren("dpmenu") dpmenus: QueryList<any>;

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
    this.initAutoSuggest();
  }

  ngOnInit() {
    // this.store.dispatch(this.authActions.authorize());
    this.bShowProgress = false;
    this.isAuthenticated = this.store.select(getAuthStatus);
    this.totalCartItems = this.store.select(getTotalCartItems);
    this.totalCartValue = this.store.select(getTotalCartValue);
    this.categories$ = this.store.select(getTaxonomies);
    this.sortSubs = this.store.select(getSortSettings).subscribe(sort => {
      this.sortSettings = sort;
    });
    this.catSubs = this.categories$.subscribe(data => {
      // flatten level 1 and 2 categories
      this.categories = data.concat([].concat.apply([], data.map(cat => cat.subCategories)));
    });
  }

  ngOnDestroy() {
    this.catSubs.unsubscribe();
    this.sortSubs.unsubscribe();
    this.subscription.unsubscribe();
  }
  toggle() {
    this.shouldShow = !this.shouldShow;
    if (this.show) {
      //return this.show = false;
    }
  }

  selectCategory(...categories): void {
    // if(typeof(index) != 'undefined') {
    //   this.menuDelay.clicked[index] = true;
    // }
    let filters;
    if(categories[0] == 'all') {
      this.store.dispatch(this.productActions.getAllProducts(this.sortSettings));
    } else {
      filters = {
        mode: 'category',
        level: categories[0].level,
        categoryId: categories[0].id,
        breadcrumbs: categories.map(cat => { return {id: cat.id, name: cat.name, level: cat.level}}).reverse()
      }
      this.store.dispatch(this.productActions.getItemsByCategory(filters, this.sortSettings));
    }
    this.store.dispatch(this.searchActions.setFilter({
      filters: filters ? [filters]: [],
      categoryIds: []
    }));
    this.router.navigateByUrl('/');
    window.scrollTo(0, 0);
  }

  searchKeyword(): void {
    if(this.asyncSelected && this.asyncSelected.length > 1){
      this.bShowProgress = true;
      this.setProgressDisplayTimer();
      const filters = {
        mode: 'search',
        keyword: this.asyncSelected
      };
      this.store.dispatch(this.searchActions.setFilter({
        filters: [filters],
        categoryIds: []
      }));
      this.store.dispatch(this.productActions.getItemsByKeyword(filters, this.sortSettings));
      this.router.navigateByUrl('/');
      window.scrollTo(0, 0);
    }
    setTimeout(() => this.inputString = '', 300);
  }

  onMenuToggle(): void{
    this.cd.markForCheck();
  }

  //  NOTE: MEGA MENU DELAY CODE - START
  /*
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
  */
  //  NOTE: MEGA MENU DELAY CODE - END

  // NOTE: AUTO SUGGEST CODE - START
  initAutoSuggest(): void {
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
          let dataItems = data.list;
          let dataCategories = data.categories;
          let mergedData = [], itemctr = 0, i = 0;

          for(let key in dataItems) {
            mergedData[itemctr++] = Object.assign({group:'ITEMS'}, dataItems[key]);
          }
          for(let key in dataCategories) {
            mergedData[itemctr++] = Object.assign({group:'CATEGORIES'}, dataCategories[key]);
            if(++i >= 5) {
              break;
            }
          }
          return mergedData;
        })
    )
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  changeTypeaheadNoResults(e: boolean): void {
    this.typeaheadNoResults = e;
  }

  typeaheadOnSelect(e): void {
    if(e.key)
    {
      this.inputString = this.asyncSelected;
      this.searchKeyword();
    }
    if(!this.inputString){
      if(e.item.group.toUpperCase() == 'ITEMS') {
        this.asyncSelected = e.item.name;
        if(this.isHomeRoute) {
          const slug = `/item/${e.item.id}/${e.item.slug}`;
          window.history.pushState('item-slug', 'Title', slug);
          this.store.dispatch(this.productActions.addSelectedItem(e.item));
        } else {
          this.router.navigateByUrl(`/item/${e.item.id}/${e.item.slug}`);
        }
      } else {
        this.asyncSelected = e.item.name.replace(/\b\w/g, l => l.toUpperCase());
        let category1, category2;
        switch(e.item.level) {
          case "1":
            this.selectCategory(e.item)
            break;
          case "2": // selectCategory(level2, level1)
            category1 = this.categories.find(cat => cat.id == e.item.category_id);
            this.selectCategory(e.item, category1);
            break;
          case "3": // selectCategory(level3, level2, level1)
            category2 = this.categories.find(cat => cat.id == e.item.category_id);
            category1 = this.categories.find(cat => cat.id == category2.category_id);
            this.selectCategory(e.item, category2, category1);
            break;
          }
        }
      }
      else { this.asyncSelected = this.inputString; }
    }
  // NOTE: AUTO SUGGEST CODE - END

  setProgressDisplayTimer(): void {
    this.timer = Observable.timer(50); // 5000 millisecond means 5 seconds
      this.subscription = this.timer.subscribe(() => {
      // set showloader to false to hide loading div from view after 5 seconds
      this.bShowProgress = false;
    });
  }

  selectItem(item: Item) {
    this.selectedItem = item;
    this.store.dispatch(this.productActions.addSelectedItem(item));
  }

  getItemImageUrl(key) {
    let url = "";
    if (!key) {
      url = "assets/omg-03.png";
    } else {
      url = environment.IMAGE_REPO + key + ".jpg";
    }
    return url;
  }

  onImageError(e: any): void {
    e.target.src = "assets/omg-03.png";
  }

}
