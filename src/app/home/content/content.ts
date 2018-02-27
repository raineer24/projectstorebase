// import { Product } from './../../core/models/product';
import { Item } from './../../core/models/item';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-content',
  template: `
    <div class="row">
      <div class="col-md-6"></div>
      <div class="col-md-6 text-right">
        <app-content-header [filterSettings]="filters" [sortSettings]="sorting"></app-content-header>
      </div>
    </div>
    <app-item-list [(toggleLayout)]="toggleLayout"
      [items]="products"
      [cartItems]="cartItemsArr"
      [sortSettings]="sorting"
      [filterSettings]="filters" >
    </app-item-list>
  `,
//   styleUrls: ['./content-header.component.scss']
})
export class ContentComponent implements OnInit {
  @Input() products: Item[];
  @Input() cartItemsArr: Item[];
  @Input() filters: any;
  @Input() sorting: any;
  toggleLayout = {size: 'COZY'};

  constructor() { }

  ngOnInit() {
  }

  toggleSize(layoutInfo) {
    this.toggleLayout = layoutInfo;
  }

}


// <app-content-header (toggleSize)="toggleSize($event)"></app-content-header>
// <app-filter-summary></app-filter-summary>
// <app-customize></app-customize>
// <app-item-list [(toggleLayout)]='toggleLayout' [items]='products' [taxonIds]="taxonIds"></app-item-list>
