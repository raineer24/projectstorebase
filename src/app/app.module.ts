import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";

// Components
import { AppComponent } from "./app.component";
// Routes
import { routes } from "./app.routes";
// Providers
import { Globals } from "./globals";
// Modules
import { SharedModule } from "./shared/index";
import { UserModule } from "./user/index";
import { HomeModule } from "./home/index";
import { LayoutModule } from "./layout/index";
import { SellerModule } from "./seller/index";
import { AdminModule } from "./admin/admin.module";
import { CoreModule } from "./core/index";
import { StoreModule } from "@ngrx/store";
import { reducer } from "./app.reducers";
import { CheckoutHeaderComponent } from "./layout/checkout-header/checkout-header.component";
import { CheckoutFooterComponent } from "./layout/checkout-footer/checkout-footer.component";
import { SpinnerModule } from "primeng/primeng";



// adding rx operators
import "rxjs/add/operator/map";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import "rxjs/add/operator/finally";
import "rxjs/add/observable/of";
import "rxjs/add/observable/empty";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/operator/takeUntil";

// 3rd party imports
import { BsDropdownModule } from "ngx-bootstrap";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { ModalModule } from "angular-custom-modal";


@NgModule({
  declarations: [
    AppComponent,
    CheckoutHeaderComponent,
    CheckoutFooterComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    StoreModule.provideStore(reducer),
    BrowserModule,
    FormsModule,
    HttpModule,
    HomeModule,
    LayoutModule,
    CoreModule,
    AdminModule,
    StoreModule.provideStore(reducer),
    StoreDevtoolsModule.instrumentOnlyWithExtension({
      maxAge: 10
    }),
    SharedModule,
    ModalModule,
    BsDropdownModule,
    SpinnerModule,


  ],
  providers: [Globals],
  bootstrap: [AppComponent]
})
export class AppModule {}
