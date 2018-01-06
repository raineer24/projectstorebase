import { Component, OnDestroy, OnInit, Input } from "@angular/core";


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
 
  constructor(
   
    private store: Store<AppState>
  ) {}

 

  ngOnInit() {
    this.products$ = this.store.select(getProducts);
  }

  ngOnDestroy() {}

   val1: number;

    val2: number;

    val3: number;

    val4: number = 100;
}
