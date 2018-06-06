import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Pipes
import { KeysPipe } from './pipes/keys.pipe';
import { HumanizePipe } from '../core/pipes/humanize.pipe';

// components
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { NotificationComponent } from './components/notification/notification.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { StaticPagesComponent } from './components/static-pages/static-pages.component';


// imports
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    // components
    LoadingIndicatorComponent,
    NotificationComponent,
    StarRatingComponent,
    StaticPagesComponent,
    // pipes
    KeysPipe,
    HumanizePipe
  ],
  exports: [
    // components
    LoadingIndicatorComponent,
    NotificationComponent,
    StarRatingComponent,
    StaticPagesComponent,
    // modules
    CommonModule,
    BsDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    // pipes
    KeysPipe,
    HumanizePipe
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BsDropdownModule.forRoot()
  ]
})
export class SharedModule {}
