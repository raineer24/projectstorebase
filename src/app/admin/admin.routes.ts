import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { OrdersComponent } from './orders/orders.component';
import { UsersComponent } from './users/users.component';
import { UsersEditComponent } from './users/users-edit/users-edit.component';
import { ViewOrderComponent } from './orders/view-order/view-order.component';

export const AdminRoutes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      // { path: '', redirectTo: 'orders'}
      { path: 'orders', component: OrdersComponent},
      { path: 'users', component: UsersComponent},
      { path: 'users-edit', component: UsersEditComponent},
      { path: 'view-order', component: ViewOrderComponent}
    ]
  }
];
