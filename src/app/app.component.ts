import { getAuthStatus } from './auth/reducers/selectors';
import { AppState } from './interfaces';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { CheckoutService } from './core/services/checkout.service';
import { AuthService } from './core/services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ProductActions } from './product/actions/product-actions';
import * as moment from 'moment';

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
  name: string;
  show: boolean;
  errorMessage:string;
  private password = 'OmgLogin18!';
  private passwordList = [
    'xltfts8u',
    '2y4f2wkx',
    'arg9gy5k',
    'gfro54fr',
    'qfhk7kix',
    'krjytvl4',
    'f8fsdzyy',
    'yimdjcpa',
    'o2a7j8z2',
    '2iaba1no',
  ];
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
        this.findCurrentStep(this.currentUrl);
        window.scrollTo(0, 0);
      });

  }
  setValue() {
    let currentDate: string = moment().format("DD");
    console.log(currentDate);
    let index = parseInt(currentDate, 10);
    if ((index - 20 >= 0 && (this.name === this.passwordList[index])) || (this.name == this.password)) {
      this.show = true;
    }
    (!this.name == !this.password)
    this.errorMessage = this.name;
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
