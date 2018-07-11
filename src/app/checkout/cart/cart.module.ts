import { EffectsModule } from '@ngrx/effects';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
//import { BrowserModule } from "@angular/platform-browser";
import { CartItemListComponent } from './components/cart-item-list/cart-item-list.component';
import { CartItemComponent } from './components/cart-item-list/cart-item/cart-item.component';
import { OrderTotalSummaryComponent } from './components/order-total-summary/order-total-summary.component';
import { EmptyCartComponent } from './components/empty-cart/empty-cart.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { HeaderComponent } from "../../layout/header/header.component";
// import { LayoutModule } from "../../layout/index";
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    CartComponent,
    CartItemListComponent,
    CartItemComponent,
    OrderTotalSummaryComponent,
    EmptyCartComponent
  ],
  exports: [
    // HeaderComponent,
    CartItemListComponent,
    CartItemComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    //BrowserModule,
    // LayoutModule
  ],
  providers: []
})
export class CartModule {}
