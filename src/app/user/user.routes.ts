import { OverviewComponent } from './components/overview/overview.component';
import { UserComponent } from './user.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AddressesComponent } from './components/addresses/addresses.component';
import { OrderDetailComponent } from './components/orders/order-detail/order-detail.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ListsComponent } from  './components/lists/lists.component';
import { ListDetailComponent } from  './components/lists/list-detail/list-detail.component';


export const UserRoutes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', redirectTo: 'profile' },
      { path: 'overview', component: OverviewComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'orders/detail/:number', component: OrderDetailComponent },
      { path: 'addresses', component: AddressesComponent, redirectTo: 'orders' },
      { path: 'lists', component: ListsComponent },
      { path: 'lists/detail/:id', component: ListDetailComponent },
      { path: 'profile', component: ProfileComponent }]
  },
];
