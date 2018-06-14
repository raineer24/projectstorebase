import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsComponent } from './orders/components/order-details/order-details.component';
import { UsersComponent } from './users/users.component';
import { PbuComponent } from './pbu/pbu.component';
import { PbuEditComponent } from './pbu/pbu-edit/pbu-edit.component';
import { PbuAddComponent } from './pbu/pbu-add/pbu-add.component';
import { UsersEditComponent } from './users/users-edit/users-edit.component';
import { ViewOrderComponent } from './orders/view-order/view-order.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { LoginComponent } from './login/login.component';
import { AdminGuardService } from './guards/admin.guard';
import { RoleGuardService } from './guards/role.guard';
import { PrintTransactionsComponent } from './transactions/print-transactions/print-transactions.component';

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
        path: 'pbu',
        component: PbuComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,7]
        }
      },
      {
        path: 'pbu-edit',
        component: PbuEditComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,7]
        }
      },
      {
        path: 'pbu-add',
        component: PbuAddComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,7]
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
      },
      {
        path: 'print-transaction',
        component: PrintTransactionsComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [3,5]
        }
      }
    ],
    canActivate: [AdminGuardService]
  }
];
