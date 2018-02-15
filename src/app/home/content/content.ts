// import { Product } from './../../core/models/product';
import { Item } from './../../core/models/item';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-content',
  template: `
    <!-- <app-content-header></app-content-header> -->
    <app-item-list [(toggleLayout)]="toggleLayout"
      [items]="products"
      [cartItems]="cartItemsArr">
    </app-item-list>
  `,
//   styleUrls: ['./content-header.component.scss']
})
export class ContentComponent implements OnInit {
  @Input() products: Item[];
  @Input() cartItemsArr: Item[];
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
