import { Observable } from 'rxjs/Observable';
import { getSelectedProduct } from './../../../product/reducers/selectors';
import { AppState } from './../../../interfaces';
import { Store } from '@ngrx/store';
import { Item } from './../../../core/models/item';
import { environment } from './../../../../environments/environment';
import { Component, OnInit, Input, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { ProductActions } from './../../../product/actions/product-actions';
import { getFilters } from './../../reducers/selectors';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  @Input() items;
  @Input() toggleLayout;
  @Input() cartItems;
  @ViewChild('itemDetailsModal') itemDetailsModal;
  selectedItem$: Observable<any>;
  selectedItem: Item;
  autoLoadCtr: number = 0;
  delay: boolean = false;
  itemsPerPage: number = environment.ITEMS_PER_PAGE;
  itemCtr: number = this.itemsPerPage;
  filters: Array<any> = [];
  prevFilter: string = 'all';
  loadSubs: Subscription;

  constructor(
    private store: Store<AppState>,
    private actions: ProductActions
  ) {

  }

  ngOnInit() {
    this.selectedItem$ = this.store.select(getSelectedProduct);
    this.loadSubs = this.store.select(getFilters).subscribe(res => {
      this.filters = res;
    })
  }

  ngOnDestroy() {
    this.loadSubs.unsubscribe();
  }

  getMargin() {
    return this.toggleLayout.size === 'COZY' ? '0 15px 20px 0' : '0 80px 20px 0';
  }

  openItemDialog(item: Item): void {
    const slug = `/item/${item.code}/${item.slug}`;
    this.selectedItem = item;
    this.itemDetailsModal.open();

    window.history.pushState('item-slug', 'Title', slug);
  }

  closeItemDialog(): void {
    window.history.pushState('item-slug', 'Title', '/');
    this.itemDetailsModal.close();
  }

  loadMoreItems(): void {
      console.log(this.filters)
      if(this.filters.length) {
        if(this.filters[0].mode == 'search') {
          const filter = 'search:' + this.filters[0].keyword;
          this.resetLoadMoreVariables(filter);
          this.store.dispatch(this.actions.getItemsByKeyword(this.filters[0].keyword, this.itemCtr));
        } else if(this.filters[0].mode == 'category') {
          const filter = 'categoryId:' + this.filters[0].categoryId; console.log(filter+" "+this.prevFilter )
          this.resetLoadMoreVariables(filter);
          this.store.dispatch(this.actions.getItemsByCategory({
            id: this.filters[0].categoryId,
            level: this.filters[0].level
          }, this.itemCtr));
        }
      } else {
        this.resetLoadMoreVariables('all');
        this.store.dispatch(this.actions.getAllProducts(this.itemCtr));
      }
      console.log(this.itemCtr)
  }

  resetLoadMoreVariables(filter: string) {
    if(this.prevFilter == filter) {
      this.itemCtr += this.itemsPerPage;
    } else {
      this.itemCtr = this.itemsPerPage * 2;
      this.prevFilter = filter;
      this.autoLoadCtr = 1;
    }
  }

  autoLoad(): void {
    if(this.autoLoadCtr < 3 && this.items.length >= this.itemsPerPage) {
      this.autoLoadCtr++;
      this.loadMoreItems();
    }
  }

  getCartItem(id){
    return this.cartItems.find(cartItem => cartItem.item_id === id);
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        this.autoLoad(); console.log("AUTO LOAD")
    }
  }
}
