import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { SellerComponent } from './seller.component';
import { SellerAccountInfoComponent } from './seller-account-info/seller-account-info.component';
import { EditSellerAccountDetailsComponent } from './edit-seller-account-details/edit-seller-account-details.component';

import { SellerRoutes as routes } from './seller.routes';

@NgModule({
  declarations: [
    // components
  	SellerComponent,
  	SellerAccountInfoComponent,
  	EditSellerAccountDetailsComponent
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