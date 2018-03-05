import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminRoutes as routes } from './admin.routes';
import { AdminComponent } from './admin.component';
import { OrdersComponent } from './orders/orders.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    AdminComponent
  ],
  declarations: [
    AdminComponent,
    OrdersComponent
  ]
})
export class AdminModule { }
