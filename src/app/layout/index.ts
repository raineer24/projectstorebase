import { NgModule } from '@angular/core';

// Components
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ProfileDropdownComponent } from './header/profile-dropdown/profile-dropdown.component';
// import { CartItemListComponent } from './../checkout/cart/components/cart-item-list/cart-item-list.component';
// import { CartItemComponent } from './../checkout/cart//components/cart-item-list/cart-item/cart-item.component';

// Modules
import { SharedModule } from '../shared/index';
import { RouterModule } from '@angular/router';
import { CartModule } from './../checkout/cart/cart.module';

import { TypeaheadModule } from 'ngx-bootstrap/typeahead'

@NgModule({
  declarations: [
    // components
    HeaderComponent,
    FooterComponent,

    // sub components
    ProfileDropdownComponent

    // pipes
  ],
  exports: [
    HeaderComponent,
    FooterComponent
    // CartItemListComponent,
    // CartItemComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    CartModule,
    TypeaheadModule
  ]
})
export class LayoutModule {}
