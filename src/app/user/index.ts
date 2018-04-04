import { RouterModule } from '@angular/router';
import { UserRoutes } from './user.routes';
import { NgModule } from '@angular/core';

// components
import { UserComponent } from './user.component';
import { OverviewComponent } from './components/overview/overview.component';
import { OrdersComponent } from './components/orders/orders.component';
import { OrderListItemComponent } from './components/orders/order-list-item/order-list-item.component';
import { OrderDetailComponent } from './components/orders/order-detail/order-detail.component';
import { ReturnsComponent } from './components/returns/returns.component';
import { ReturnListItemComponent } from './components/returns/return-list-item/return-list-item.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileViewComponent } from './components/profile/profile-view/profile-view.component';
import { ProfileEditComponent } from './components/profile/profile-edit/profile-edit.component';
import { ListsComponent } from  './components/lists/lists.component';
import { ListDetailComponent } from './components/lists/list-detail/list-detail.component';
import { ListEntryComponent } from './components/lists/list-entry/list-entry.component';
import { AddressesComponent } from './components/addresses/addresses.component';

// services
// import { UserService } from './services/user.service';

import { UserRoutes as routes } from './user.routes';

import { SharedModule } from '../shared/index';


@NgModule({
  declarations: [
    // components
    OverviewComponent,
    OrderListItemComponent,
    OrdersComponent,
    ReturnsComponent,
    ReturnListItemComponent,
    UserComponent,
    AddressesComponent,
    OrderDetailComponent,
    ProfileComponent,
    ProfileViewComponent,
    ProfileEditComponent,
    ListsComponent,
    ListDetailComponent,
    ListEntryComponent
    // pipes

  ],
  exports: [
    // components
    // OverviewComponent,
    // OrderListItemComponent,
    // OrdersComponent,
    // ReturnsComponent,
    // ReturnListItemComponent,

  ],
  providers: [
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class UserModule {}
