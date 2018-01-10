import { EffectsModule } from '@ngrx/effects';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
//import { BrowserModule } from "@angular/platform-browser";
import { LineItemListComponent } from './components/line-item-list/line-item-list.component';
import { LineItemComponent } from './components/line-item-list/line-item/line-item.component';
import { OrderTotalSummaryComponent } from './components/order-total-summary/order-total-summary.component';
import { EmptyCartComponent } from './components/empty-cart/empty-cart.component';
import { FormsModule } from "@angular/forms";
import { SpinnerModule } from "primeng/primeng";

@NgModule({
  declarations: [
    CartComponent,
    LineItemListComponent,
    LineItemComponent,
    OrderTotalSummaryComponent,
    EmptyCartComponent
  ],
  exports: [],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    //BrowserModule,
    SpinnerModule
  ],
  providers: []
})
export class CartModule {}
