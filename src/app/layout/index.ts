import { NgModule } from '@angular/core';

// Components
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ProfileDropdownComponent } from './header/profile-dropdown/profile-dropdown.component';

// Modules
import { SharedModule } from '../shared/index';
import { RouterModule } from '@angular/router';


import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { SidebarJSModule } from 'ng-sidebarjs';

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
    FooterComponent,
  ],
  imports: [
    SharedModule,
    RouterModule,
    TypeaheadModule,
    SidebarJSModule.forRoot()
  ]
})
export class LayoutModule {}
