import { Routes } from '@angular/router';
import { SellerComponent } from './seller.component';
import { AccountComponent } from './components/account/account.component';
import { ViewSellerAccountComponent } from './components/account/view-seller-account/view-seller-account.component';
import { EditSellerAccountComponent } from './components/account/edit-seller-account/edit-seller-account.component';

export const SellerRoutes = [
  {
    path: '',
    component: SellerComponent,
    children: [
      { path: 'account', component: AccountComponent }
    ]
  }
];
