import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { AppState } from './../../../interfaces';
import { Store } from '@ngrx/store';
import { ProductActions } from './../../../product/actions/product-actions';
import { SearchActions } from './../../reducers/search.actions';

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.scss']
})
export class ContentHeaderComponent implements OnInit {
  @Output() toggleSize = new EventEmitter();
  @Input() filterSettings: any;
  @Input() sortSettings: any;
  selectedSize = 'COZY';
  breadcrumbs = ['Home']

  constructor(
    private store: Store<AppState>,
    private searchActions: SearchActions,
    private productActions: ProductActions,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {

  }

  ngOnChanges() {
    this.setBreadcrumbs();
  }

  setBreadcrumbs(): void {
    this.breadcrumbs = ['Home'];
    if(this.filterSettings.length) {
      switch(this.filterSettings[0].mode) {
        case 'category':
          this.breadcrumbs = this.breadcrumbs.concat(this.filterSettings[0].breadcrumbs.map(cat => cat.name));
          break;
        case 'search':
          this.breadcrumbs[1] = 'Search Results';
          break;
        default:
      }
    }
  }

  selectBreadcrumb(breadcrumb): void {
    let filters;
    if(breadcrumb == 'Home') {
      this.store.dispatch(this.productActions.getAllProducts());
    } else if(this.filterSettings[0].mode == 'category') {
      const breadcrumbs = this.filterSettings[0].breadcrumbs;
      const index = breadcrumbs.findIndex(x => x.name == breadcrumb);
      filters = {
        mode: 'category',
        level: breadcrumbs[index].level,
        categoryId: breadcrumbs[index].id,
        breadcrumbs: breadcrumbs.slice(0, index + 1)
      }
      this.store.dispatch(this.productActions.getItemsByCategory(filters, this.sortSettings));
    }
    this.store.dispatch(this.searchActions.setFilter({
      filters: filters ? [filters]: [],
      categoryIds: []
    }));
  }

  toggleView(view) {
    this.selectedSize = view;
    this.toggleSize.emit({size: view});
  }

  isSmallSelected(): boolean {
    return this.selectedSize === 'COZY';
  }

  isBigSelected(): boolean {
    return this.selectedSize === 'COMPACT';
  }

  sortItems(mode: string): void {
    let sorting = {
      sortBy: null,
      sortOrder: null
    };
    switch(mode) {
      case 'low-price':
        sorting.sortBy = 'price';
        sorting.sortOrder = 'asc';
        break;
      case 'high-price':
        sorting.sortBy = 'price';
        sorting.sortOrder = 'desc';
        break;
      default:
        break;
    }
    if(this.filterSettings.length) {
      if(this.filterSettings[0].mode == "category") {

        this.store.dispatch(this.productActions.getItemsByCategory(this.filterSettings[0], sorting));
      } else if (this.filterSettings[0].mode == "search"){
        this.store.dispatch(this.productActions.getItemsByKeyword(this.filterSettings[0], sorting))
      }
    } else {
      this.store.dispatch(this.productActions.getAllProducts(sorting));
    }
    this.store.dispatch(this.searchActions.setSorting(sorting));
  }

}
