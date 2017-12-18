import { environment } from './../../../../../environments/environment';
import { Item } from './../../../../core/models/item';
// import { Product } from './../../../../core/models/product';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-item-list-entry',
  templateUrl: './item-list-entry.component.html',
  styleUrls: ['./item-list-entry.component.scss']
})
export class ItemListEntryComponent implements OnInit {
  @Input() product: Item;
  // @Input() product: Product;

  constructor() { }

  ngOnInit() {
  }

  getProductImageUrl(url) {
    // return environment.API_ENDPOINT + url;
    return `https://angularspree-new.herokuapp.com/${url}`;
  }
}
