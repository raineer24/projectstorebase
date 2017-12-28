// import { Product } from './../../core/models/product';
import { Item } from './../../core/models/item';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-content',
  template: `
    <app-item-list [(toggleLayout)]='toggleLayout' [items]='products' [taxonIds]="taxonIds"></app-item-list>
  `,
//   styleUrls: ['./content-header.component.scss']
})
export class ContentComponent implements OnInit {
  // @Input() products: Product[];
  @Input() products: Item[];
  @Input() taxonIds;
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
