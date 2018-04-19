import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from "ngx-bootstrap";

import { AdminRoutes as routes } from './admin.routes';
import { AdminComponent } from './admin.component';
import { OrdersComponent } from './orders/orders.component';
import { ViewOrderComponent } from './orders/view-order/view-order.component';
import { OrderDetailsComponent } from './orders/components/order-details/order-details.component';
import { UsersComponent } from './users/users.component';
import { UsersEditComponent } from './users/users-edit/users-edit.component';
import { SharedModule } from '../shared/index';
import { TransactionsComponent, SortPipe } from './transactions/transactions.component';
import { PrintTransactionsComponent } from './transactions/print-transactions/print-transactions.component';
import { ModalModule } from 'angular-custom-modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead'
@NgModule({
  declarations: [
    AdminComponent,
    OrdersComponent,
    ViewOrderComponent,
    UsersComponent,
    UsersEditComponent,
    OrderDetailsComponent,
    TransactionsComponent,
    PrintTransactionsComponent,
    SortPipe
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ButtonsModule.forRoot(),
    ModalModule,
    TypeaheadModule
  
  
  ],
  exports: [
    AdminComponent
  ]
})
export class AdminModule { }
