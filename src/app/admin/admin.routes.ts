import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsComponent } from './orders/components/order-details/order-details.component';
import { OrderAssemblyComponent } from './order-assembly/order-assembly.component';
import { OrderAssembleComponent } from './order-assembly/components/order-assemble/order-assemble.component';
import { OrderDeliverComponent } from './order-assembly/components/order-deliver/order-deliver.component';
import { UsersComponent } from './users/users.component';
import { PbuComponent } from './pbu/pbu.component';
import { PbuEditComponent } from './pbu/pbu-edit/pbu-edit.component';
import { PbuAddComponent } from './pbu/pbu-add/pbu-add.component';
import { UsersEditComponent } from './users/users-edit/users-edit.component';
import { AddEditUsersComponent } from './users/components/add-edit-users/add-edit-users.component';
import { ViewOrderComponent } from './orders/view-order/view-order.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { LoginComponent } from './login/login.component';
import { LogsComponent } from './logs/logs.component';
import { AdminGuardService } from './guards/admin.guard';
import { RoleGuardService } from './guards/role.guard';
import { PrintTransactionsComponent } from './transactions/print-transactions/print-transactions.component';
import { ManageTimeslotComponent } from './tools/manage-timeslot/manage-timeslot.component';
import { MasterListComponent } from './master-list/master-list.component';
import { ItemListComponent } from './master-list/components/item-list/item-list.component';
import { AddItemsComponent } from './master-list/components/add-items/add-items.component';
import { UpdateItemsComponent } from './master-list/components/update-items/update-items.component';
import { AddCategoryComponent } from './master-list/components/add-category/add-category.component';
import { ResetPasswordComponent } from './users/components/reset-password/reset-password.component';


export const AdminRoutes = [
  {
    path: 'admin/login',
    component: LoginComponent
  },
  {
    path: 'admin/resetPassword',
    component: ResetPasswordComponent
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
          expectedRole: [1,4,9,10],
        }
      },
      {
        path: 'order-assemble/edit/:id',
        component: OrderAssembleComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,4,9,10],
        }
      },
      {
        path: 'order-assemble/view/:id',
        component: OrderDeliverComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,4,9,10]
        }
      },
      {
        path: 'orders',
        component: OrdersComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,2,4,5,6,8,11,12,13]
        }
      },
      {
        path: 'orders/view/:id',
        component: OrderDetailsComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,2,4,5,6,8,11,12,13]
        }
      },
      // {
      //   path: 'view-order',
      //   component: ViewOrderComponent,
      //   canActivate: [RoleGuardService],
      //   data: {
      //     expectedRole: [1,2,6]
      //   }
      // },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,2,3,7]
        }
      },
      {
        path: 'users/edit/:id',
        component: AddEditUsersComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,2,3,7]
        }
      },
      {
        path: 'users/add',
        component: AddEditUsersComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,2,3,7]
        }
      },
      {
        path: 'logs',
        component: LogsComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole:[1,2,3]
        }
      },
      {
        path: 'pbu',
        component: PbuComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,8]
        }
      },
      {
        path: 'pbu-edit',
        component: PbuEditComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,8]
        }
      },
      {
        path: 'pbu-add',
        component: PbuAddComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,8]
        }
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,5]
        }
      },
      {
        path: 'print-transaction',
        component: PrintTransactionsComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: [1,5]
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
      {
        path: 'master-list',
        component: MasterListComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole:[1,2,3]
        }
      },
      {
        path: 'master-list/components/add-items',
        component: AddItemsComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole:[1,2,3]
        }
      },
      {
        path: 'master-list/components/update-items',
        component: UpdateItemsComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole:[1,2,3]
        }
      },
      {
        path: 'master-list/components/item-list',
        component: ItemListComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole:[1,2,3]
        }
      },
      // {
      //   path: 'master-list/components/add-category',
      //   component: AddCategoryComponent,
      //   canActivate: [RoleGuardService],
      //   data: {
      //     expectedRole:[1,2,3]
      //   }
      // },
    ],
    canActivate: [AdminGuardService]
  }
];
