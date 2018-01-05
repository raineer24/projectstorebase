import { Component, OnDestroy, OnInit, Input } from "@angular/core";
import { ProductActions } from "./../../../../product/actions/product-actions";
import { Item } from "./../../../../core/models/item";
import { AppState } from "./../../../../interfaces";
import { Store } from "@ngrx/store";
import { getProducts, getTaxonomies } from "./../../../../product/reducers/selectors";
import { Observable } from "rxjs/Observable";

@Component({
  selector: "app-empty-cart",
  templateUrl: "./empty-cart.component.html",
  styleUrls: ["./empty-cart.component.scss"]
})
export class EmptyCartComponent implements OnInit, OnDestroy {
  products$: Observable<any>;
  @Input() item: Item;
  @Input() items;
  @Input() product: Item;
  constructor(
    private productActions: ProductActions,
    private store: Store<AppState>
  ) {}

  // Items = [
  //   {
  //      name: 'Mango',
  //      description: 'Organic fruits'
  //   }

  // ];

  ngOnInit() {
    this.products$ = this.store.select(getProducts);
  }

  ngOnDestroy() {}
}
