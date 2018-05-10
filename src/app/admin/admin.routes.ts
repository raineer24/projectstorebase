import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsComponent } from './orders/components/order-details/order-details.component';
import { UsersComponent } from './users/users.component';
import { UsersEditComponent } from './users/users-edit/users-edit.component';
import { ViewOrderComponent } from './orders/view-order/view-order.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { LoginComponent } from './login/login.component';
import { AdminGuardService } from './guards/admin.guard';
import { RoleGuardService } from './guards/role.guard';


export const AdminRoutes = [
  {
    path: 'admin/login',
    component: LoginComponent
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'orders',
        component: OrdersComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [2,5]
        }
      },
      {
        path: 'orders/edit/:id',
        component: OrderDetailsComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [2,5]
        }
      },
      {
        path: 'view-order',
        component: ViewOrderComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [2,5]
        }
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,5]
        }
      },
      {
        path: 'users-edit',
        component: UsersEditComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,5]
        }
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [3,5]
        }
      }
    ],
    canActivate: [AdminGuardService]
  }
];
