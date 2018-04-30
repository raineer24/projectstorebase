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
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
<<<<<<< HEAD
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
=======
import { DataTableModule } from 'primeng/primeng';
>>>>>>> 848646e652505fc976e77f31b99b4565f2f74363
@NgModule({
  declarations: [
    AdminComponent,
    OrdersComponent,
    ViewOrderComponent,
    UsersComponent,
    UsersEditComponent,
    TransactionsComponent,
    OrderDetailsComponent,
<<<<<<< HEAD
      PrintTransactionsComponent,
      SortPipe
=======
    PrintTransactionsComponent,
    SortPipe
>>>>>>> 848646e652505fc976e77f31b99b4565f2f74363

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ButtonsModule.forRoot(),
<<<<<<< HEAD
      ModalModule,
      TypeaheadModule,
    //BrowserAnimationsModule
=======
    ModalModule,
    TypeaheadModule,
    DataTableModule
>>>>>>> 848646e652505fc976e77f31b99b4565f2f74363
  ],
  exports: [
    AdminComponent
  ]
})
export class AdminModule { }