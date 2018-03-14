import { NgModule } from '@angular/core';

// Components
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ProfileDropdownComponent } from './header/profile-dropdown/profile-dropdown.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Modules
import { SharedModule } from '../shared/index';
import { RouterModule } from '@angular/router';


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
    FooterComponent,
  ],
  imports: [
    SharedModule,
    RouterModule,
    TypeaheadModule,
    BrowserAnimationsModule
  ]
})
export class LayoutModule {}
