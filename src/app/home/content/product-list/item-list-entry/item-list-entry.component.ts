import { environment } from './../../../../../environments/environment';
import { Product } from './../../../../core/models/product';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-item-list-entry',
  templateUrl: './item-list-entry.component.html',
  styleUrls: ['./item-list-entry.component.scss']
})
export class ItemListEntryComponent implements OnInit {
  @Input() product: Product;

  constructor() { }

  ngOnInit() {
  }

  getProductImageUrl(url) {
    return environment.API_ENDPOINT + url;
  }
}

