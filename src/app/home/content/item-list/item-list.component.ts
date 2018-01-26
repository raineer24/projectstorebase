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
  itemLimit: number = environment.ITEMS_PER_PAGE;
  autoLoadCtr: number = 0;
  delay: boolean = false;


  constructor(
    private store: Store<AppState>, private actions: ProductActions ) {

  }


  ngOnInit() {
    this.selectedItem$ = this.store.select(getSelectedProduct);
  }

  getMargin() {
    return this.toggleLayout.size === 'COZY' ? '0 15px 20px 0' : '0 80px 20px 0';
  }

  openItemDialog(item: Item) {
    const slug = `/item/${item.code}/${item.slug}`;
    this.selectedItem = item;
    this.itemDetailsModal.open();

    window.history.pushState('item-slug', 'Title', slug);
  }

  closeItemDialog() {
    window.history.pushState('item-slug', 'Title', '/');
    this.itemDetailsModal.close();
  }

  loadMoreItems() {
    this.itemLimit += environment.ITEMS_PER_PAGE;
    this.store.dispatch(this.actions.getAllProducts(this.itemLimit));
  }

  autoLoad() {
    if(this.autoLoadCtr < 3) {
      this.autoLoadCtr++;
      this.loadMoreItems();
      console.log("TEST")
    }
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        console.log("BOTTOM")
        this.autoLoad();
      }
  }
}
