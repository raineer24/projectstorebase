import { Observable } from 'rxjs/Observable';
import { getSelectedProduct } from './../../../product/reducers/selectors';
import { AppState } from './../../../interfaces';
import { Store } from '@ngrx/store';
import { Item } from './../../../core/models/item';
import { environment } from './../../../../environments/environment';
import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { ProductActions } from './../../../product/actions/product-actions';

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

  constructor(
    private store: Store<AppState>, private actions: ProductActions ) {

  }


  ngOnInit() {
    this.selectedItem$ = this.store.select(getSelectedProduct);
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
    console.log('Item Dialog Closed!');
  }

  loadMoreItems(): void {
    this.itemCtr += this.itemsPerPage;
    this.store.dispatch(this.actions.getAllProducts(this.itemCtr));
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
        this.autoLoad();
    }
  }
}
