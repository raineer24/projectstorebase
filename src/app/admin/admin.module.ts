import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from "ngx-bootstrap";

import { AdminRoutes as routes } from './admin.routes';
import { AdminComponent } from './admin.component';
import { AdminGuardService } from './guards/admin.guard';
import { RoleGuardService } from './guards/role.guard';
import { LoginComponent } from './login/login.component';
import { LogsComponent } from './logs/logs.component';
import { OrdersComponent } from './orders/orders.component';
import { ViewOrderComponent } from './orders/view-order/view-order.component';
import { OrderDetailsComponent } from './orders/components/order-details/order-details.component';
import { AdminService } from './services/admin.service';
import { ManageTimeslotComponent } from './tools/manage-timeslot/manage-timeslot.component';
import { MasterListComponent } from './master-list/master-list.component';
import { AddItemsComponent } from './master-list/components/add-items/add-items.component';
import { UpdateItemsComponent } from './master-list/components/update-items/update-items.component';
import { AddCategoryComponent } from './master-list/components/add-category/add-category.component';
import { ItemListComponent } from './master-list/components/item-list/item-list.component';
import { PrintTransactionsComponent } from './transactions/print-transactions/print-transactions.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { SortPipe } from './transactions/transactions.component';
import { UsersComponent } from './users/users.component';
import { PbuComponent } from './pbu/pbu.component';
import { PbuEditComponent } from './pbu/pbu-edit/pbu-edit.component';
import { PbuAddComponent } from './pbu/pbu-add/pbu-add.component';
import { UsersEditComponent } from './users/users-edit/users-edit.component';
import { OrderAssemblyComponent } from './order-assembly/order-assembly.component';
import { OrderDeliverComponent } from './order-assembly/components/order-deliver/order-deliver.component';
import { OrderAssembleComponent } from './order-assembly/components/order-assemble/order-assemble.component';
import { AddEditUsersComponent } from './users/components/add-edit-users/add-edit-users.component';
import { ResetPasswordComponent } from './users/components/reset-password/reset-password.component';
import { SharedModule } from '../shared/index';

// 3rd party
import { ModalModule as CustomModalModule } from 'angular-custom-modal';
import { BsDropdownModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DataTableModule, PaginatorModule, ButtonModule } from 'primeng/primeng';


@NgModule({
  declarations: [
    AdminComponent,
    OrdersComponent,
    ViewOrderComponent,
    UsersComponent,
    PbuComponent,
    PbuEditComponent,
    PbuAddComponent,
    UsersEditComponent,
    TransactionsComponent,
    OrderDetailsComponent,
    LoginComponent,
    LogsComponent,
    LoginComponent,
    PrintTransactionsComponent,
    SortPipe,
    ManageTimeslotComponent,
    MasterListComponent,
    ItemListComponent,
    AddItemsComponent,
    UpdateItemsComponent,
    AddCategoryComponent,
    OrderAssemblyComponent,
    OrderDeliverComponent,
    OrderAssembleComponent,
    AddEditUsersComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ButtonsModule.forRoot(),
    ModalModule.forRoot(),
    TypeaheadModule,
    DataTableModule,
    PaginatorModule,
    ButtonModule,
    BsDropdownModule.forRoot(),
    CustomModalModule,
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
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
