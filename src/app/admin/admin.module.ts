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


@NgModule({
  declarations: [
    AdminComponent,
    OrdersComponent,
    ViewOrderComponent,
    UsersComponent,
    UsersEditComponent,
    OrderDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ButtonsModule.forRoot()
  ],
  exports: [
    AdminComponent
  ]
})
export class AdminModule { }
