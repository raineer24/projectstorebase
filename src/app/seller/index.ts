import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SellerRoutes } from './seller.routes';

import { SellerComponent } from './seller.component';
import { AccountComponent } from './components/account/account.component';
import { ViewSellerAccountComponent } from './components/account/view-seller-account/view-seller-account.component';
import { EditSellerAccountComponent } from './components/account/edit-seller-account/edit-seller-account.component';


import { SellerRoutes as routes } from './seller.routes';

@NgModule({
  declarations: [
    // components
  	SellerComponent,
    AccountComponent,
  	ViewSellerAccountComponent,
    EditSellerAccountComponent
    // pipes
  ],
  exports: [
    // components

  ],
  imports: [
    RouterModule.forChild(routes),
  ],
  providers: [
  ]
})
export class SellerModule {}
