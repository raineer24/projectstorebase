import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { OrdersComponent } from './orders/orders.component';

export const AdminRoutes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      // { path: '', redirectTo: 'orders'}
      { path: 'orders', component: OrdersComponent }
    ]
  }
];
