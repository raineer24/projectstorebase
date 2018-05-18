import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsComponent } from './orders/components/order-details/order-details.component';
import { UsersComponent } from './users/users.component';
import { UsersEditComponent } from './users/users-edit/users-edit.component';
import { ViewOrderComponent } from './orders/view-order/view-order.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { LoginComponent } from './login/login.component';
import { PrintTransactionsComponent } from './transactions/print-transactions/print-transactions.component';
export const AdminRoutes = [
  {
    path: 'admin/login',
    component: LoginComponent
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      // { path: '', redirectTo: 'orders'}
      { path: 'orders', component: OrdersComponent },
      { path: 'orders/edit/:id', component: OrderDetailsComponent },
      { path: 'users', component: UsersComponent},
      { path: 'users-edit', component: UsersEditComponent},
      { path: 'view-order', component: ViewOrderComponent},
      { path: 'transactions', component: TransactionsComponent },
      { path: 'print-transaction', component: PrintTransactionsComponent }
    ]
  }
];
