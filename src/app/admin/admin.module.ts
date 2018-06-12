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
import { TransactionsComponent } from './transactions/transactions.component';
import { LoginComponent } from './login/login.component';
import { LogsComponent } from './logs/logs.component';
import { AdminService } from './services/admin.service';
import { AdminGuardService } from './guards/admin.guard';
import { RoleGuardService } from './guards/role.guard';
import { PrintTransactionsComponent } from './transactions/print-transactions/print-transactions.component';
import { ModalModule } from 'angular-custom-modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { DataTableModule, PaginatorModule, ButtonModule } from 'primeng/primeng';
import { BsDropdownModule } from 'ngx-bootstrap';
import { SortPipe } from './transactions/transactions.component';

@NgModule({
  declarations: [
    AdminComponent,
    OrdersComponent,
    ViewOrderComponent,
    UsersComponent,
    UsersEditComponent,
    TransactionsComponent,
    OrderDetailsComponent,
    // save-address,
    LoginComponent,
    LogsComponent,
    // seller-auth,
    LoginComponent,
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
    TypeaheadModule,
    DataTableModule,
    PaginatorModule,
    ButtonModule,
    BsDropdownModule.forRoot()


  ],
  exports: [
    AdminComponent
  ],
  providers: [
    AdminService,
    AdminGuardService,
    RoleGuardService
  ]
})
export class AdminModule { }
