import { getAuthStatus } from './auth/reducers/selectors';
import { AppState } from './interfaces';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { CheckoutService } from './core/services/checkout.service';
import { AuthService } from './core/services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ProductActions } from './product/actions/product-actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  orderSub$: Subscription;
  currentUrl: string;
  currentStep: string;
  checkoutUrls = ['/checkout/cart', '/checkout/address', '/checkout/payment', '/checkout/confirm'];
  homeUrls = ['/', '/item']

  constructor(
    private router: Router,
    private authService: AuthService,
    private checkoutService: CheckoutService,
    private store: Store<AppState>,
    private actions: ProductActions
    ) {
    router
      .events
      .filter(e => e instanceof NavigationEnd)
      .subscribe((e: NavigationEnd) => {
        this.currentUrl = e.url;
        console.log(this.currentUrl +" "+ this.isHomeRoute())
        this.findCurrentStep(this.currentUrl);
        window.scrollTo(0, 0);
      });
  }

  ngOnInit() {
    this.authService.checkSessionPersistence();
    this.store.select(getAuthStatus)
    .subscribe(() => {
        this.orderSub$ = this.checkoutService.fetchCurrentOrder()
          .subscribe();
      });
    this.store.dispatch(this.actions.getAllProducts());
    this.store.dispatch(this.actions.getAllTaxonomies());
  }

  isHomeRoute() {
    if (!this.currentUrl) {
      return false;
    }
    const index = this.homeUrls.indexOf(this.currentUrl);
    if (index >= 0) {
      return true;
    } else if (this.currentUrl.indexOf('/item/') >= 0){
      return true;
    } else {
      return false;
    }
  }

  isAdminRoute() {
    if (!this.currentUrl) {
      return false;
    }
    if (this.currentUrl.indexOf('/admin') >= 0) {
      return true;
    } else {
      return false;
    }
  }

  private findCurrentStep(currentRoute) {
    const currRouteFragments = currentRoute.split('/');
    const length = currRouteFragments.length;
    this.currentStep = currentRoute.split('/')[length - 1];
  }

  ngOnDestroy() {
    this.orderSub$.unsubscribe();
  }

}
