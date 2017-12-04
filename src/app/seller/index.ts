import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { SellerComponent } from './seller.component';
import { ViewSellerAccountInfoComponent } from './components/view-seller-account-info/view-seller-account-info.component';
import { EditSellerAccountComponent } from './components/edit-seller-account/edit-seller-account.component';


import { SellerRoutes as routes } from './seller.routes';

@NgModule({
  declarations: [
    // components
  	SellerComponent,
  	ViewSellerAccountInfoComponent,
    EditSellerAccountComponent,
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