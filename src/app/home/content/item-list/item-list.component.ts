import { Component, OnInit, Input, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from './../../../interfaces';
import { environment } from './../../../../environments/environment';
import { getFilters } from './../../reducers/selectors';
import { getAuthStatus } from './../../../auth/reducers/selectors';
import { Item } from './../../../core/models/item';
import { ProductService } from './../../../core/services/product.service';
import { ProductActions } from './../../../product/actions/product-actions';
import { getSelectedItem } from './../../../product/reducers/selectors';
import { getUserLists } from './../../../user/reducers/selector';


@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  @Input() items;
  @Input() toggleLayout;
  @Input() cartItems;
  @Input() sortSettings;
  @Input() categories;
  @Input() filterSettings: Array<any> = [];
  @ViewChild('itemDetailsModal') itemDetailsModal;
  selectedItem$: Observable<any>;
  isAuthenticated$: Observable<boolean>;
  userLists$: Observable<Array<any>>
  selectedItem: Item;
  autoLoadCtr: number = 0;
  delay: boolean = false;
  itemsPerPage: number = environment.ITEMS_PER_PAGE;
  itemCtr: number = this.itemsPerPage;
  prevFilter: string = 'all';

  constructor(
    private store: Store<AppState>,
    private actions: ProductActions,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.route.params.map((params: any) => params['id'])
      .subscribe(itemId => {
        if(itemId) {
           this.productService.getProduct(itemId.toString()).subscribe(item => {
            this.store.dispatch(this.actions.addSelectedItem(item[0]));
          })
        }
      });
    this.store.select(getSelectedItem).subscribe(item => {
      if(item.id) {
        this.selectedItem = item;
        this.itemDetailsModal.open();
      }
    })
    this.isAuthenticated$ = this.store.select(getAuthStatus);
    this.userLists$ = this.store.select(getUserLists);
  }

  ngOnDestroy() {
  }

  getMargin() {
    return this.toggleLayout.size === 'COZY' ? '0 15px 20px 0' : '0 80px 20px 0';
  }

  openItemDialog(item: Item): void {
    const slug = `/item/${item.id}/${item.slug}`;
    window.history.pushState('item-slug', 'Title', slug);
    this.store.dispatch(this.actions.addSelectedItem(item));
  }

  closeItemDialog(): void {
    window.history.pushState('item-slug', 'Title', '/');
    this.store.dispatch(this.actions.removeSelectedItem());
    this.itemDetailsModal.close();
  }

  loadMoreItems(isAutoLoad: boolean = false): void {
    if(this.filterSettings.length) {
      if(this.filterSettings[0].mode == 'search') {
        const filter = 'search:' + this.filterSettings[0].keyword;
        if(this.resetLoadMoreVariables(filter, isAutoLoad)) {
          this.store.dispatch(this.actions.getItemsByKeyword(this.filterSettings[0], this.sortSettings, this.itemCtr));
        }
      } else if(this.filterSettings[0].mode == 'category') {
        const filter = 'categoryId:' + this.filterSettings[0].categoryId;
        if(this.resetLoadMoreVariables(filter, isAutoLoad)) {
          this.store.dispatch(this.actions.getItemsByCategory(this.filterSettings[0], this.sortSettings, this.itemCtr));
        }
      }
    } else {
      if(this.resetLoadMoreVariables('all', isAutoLoad)) {
        this.store.dispatch(this.actions.getAllProducts(this.sortSettings,this.itemCtr));
      }
    }
  }

  resetLoadMoreVariables(filter: string, autoLoad: boolean = false): boolean {
    let isAutoLoad = true;
    if(this.prevFilter == filter) {
      if(this.autoLoadCtr < 3 && this.items.length >= this.itemsPerPage) {
        this.autoLoadCtr++;
        this.itemCtr += this.itemsPerPage;
      } else if (autoLoad){
        isAutoLoad = false;
      } else {
        this.itemCtr += this.itemsPerPage;
      }
    } else {
      this.itemCtr = this.itemsPerPage * 2;
      this.prevFilter = filter;
      this.autoLoadCtr = 1;
    }
    return isAutoLoad;
  }

  autoLoad(): void {
    this.loadMoreItems(true);
  }

  getCartItem(id){
    return this.cartItems.find(cartItem => cartItem.item_id === id);
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 225)
    && this.items.length % this.itemsPerPage == 0) {
        this.autoLoad();
    }
  }
}
