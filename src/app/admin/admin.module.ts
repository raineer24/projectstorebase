import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminRoutes as routes } from './admin.routes';
import { AdminComponent } from './admin.component';
import { OrdersComponent } from './orders/orders.component';
import { ViewOrderComponent } from './orders/view-order/view-order.component';
import { UsersComponent } from './users/users.component';
import { UsersEditComponent } from './users/users-edit/users-edit.component';
import { SharedModule } from '../shared/index';
import { TransactionsComponent, SortPipe } from './transactions/transactions.component';
import { PrintTransactionsComponent } from './transactions/print-transactions/print-transactions.component';
import { ModalModule } from 'angular-custom-modal';

@NgModule({
  declarations: [
    AdminComponent,
    OrdersComponent,
    ViewOrderComponent,
    UsersComponent,
    UsersEditComponent,
    TransactionsComponent,
    PrintTransactionsComponent,
    SortPipe
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ModalModule
  
  
  ],
  exports: [
    AdminComponent
  ]
})
export class AdminModule { }
