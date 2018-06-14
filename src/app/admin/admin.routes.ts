import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsComponent } from './orders/components/order-details/order-details.component';
import { OrderAssemblyComponent } from './order-assembly/order-assembly.component';
import { OrderAssembleComponent } from './order-assembly/components/order-assemble/order-assemble.component';
import { OrderDeliverComponent } from './order-assembly/components/order-deliver/order-deliver.component';
import { UsersComponent } from './users/users.component';
import { UsersEditComponent } from './users/users-edit/users-edit.component';
import { ViewOrderComponent } from './orders/view-order/view-order.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { LoginComponent } from './login/login.component';
import { AdminGuardService } from './guards/admin.guard';
import { RoleGuardService } from './guards/role.guard';
import { PrintTransactionsComponent } from './transactions/print-transactions/print-transactions.component';
import { ManageTimeslotComponent } from './tools/manage-timeslot/manage-timeslot.component';


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
        path: 'order-assemble',
        component: OrderAssemblyComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,4]
        }
      },
      {
        path: 'order-assemble/edit/:id',
        component: OrderAssembleComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,4]
        }
      },
      {
        path: 'order-assemble/view/:id',
        component: OrderDeliverComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,4]
        }
      },
      {
        path: 'orders',
        component: OrdersComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,5,6]
        }
      },
      {
        path: 'orders/edit/:id',
        component: OrderDetailsComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,5,6]
        }
      },
      {
        path: 'view-order',
        component: ViewOrderComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,5,6]
        }
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,2,3]
        }
      },
      {
        path: 'users/edit/:id',
        component: UsersEditComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,2,3]
        }
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,5,6]
        }
      },
      {
        path: 'print-transaction',
        component: PrintTransactionsComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,5,6]
        }
      },
      {
        path: 'tools/manage-timeslot',
        component: ManageTimeslotComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,2]
        }
      },
    ],
    canActivate: [AdminGuardService]
  }
];
