import { OverviewComponent } from './components/overview/overview.component';
import { UserComponent } from './user.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AddressesComponent } from './components/addresses/addresses.component';
import { OrderDetailComponent } from './components/orders/order-detail/order-detail.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileViewComponent } from './components/profile/profile-view/profile-view.component';
import { ProfileEditComponent } from './components/profile/profile-edit/profile-edit.component';


export const UserRoutes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', redirectTo: 'profile' },
      { path: 'overview', component: OverviewComponent, redirectTo: 'profile' },
      { path: 'orders', component: OrdersComponent },
      { path: 'orders/detail/:number', component: OrderDetailComponent },
      { path: 'addresses', component: AddressesComponent, redirectTo: 'orders' },
      { path: 'profile', component: ProfileComponent }         ]
  },
];
