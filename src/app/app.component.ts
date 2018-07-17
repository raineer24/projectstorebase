import {
  getAuthStatus
} from './auth/reducers/selectors';
import {
  AppState
} from './interfaces';
import {
  Store
} from '@ngrx/store';
import {
  Subscription
} from 'rxjs/Subscription';
import {
  CheckoutService
} from './core/services/checkout.service';
import {
  AuthService
} from './core/services/auth.service';
import {
  Component,
  OnInit,
  OnDestroy,
  HostListener
} from '@angular/core';
import {
  Router,
  NavigationEnd
} from '@angular/router';
import {
  ProductActions
} from './product/actions/product-actions';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  orderSub$: Subscription;
  settingsSub$: Subscription;
  currentUrl: string = '';
  currentStep: string;
  checkoutUrls = ['/checkout/cart', '/checkout/address', '/checkout/payment', '/checkout/confirm'];
  homeUrls = ['/', '/item'];
  innerWidth: any;
  name: string;
  show: boolean;
  mobile: boolean = false;
  errorMessage: string;
  private password = 'OmgLogin18!';
  private passwordList = [
    '7v5az5r1fn',
    '5clsg0ae6r',
    'b0oav3vre8',
    'gfya8ajb6q',
    'zvkl4klrxh',
    'islf4pwlng',
    'qyo1dvw0f8',
    'bgx6ekgwm6',
    'r42e2nzlec',
    'k2b2ghwozx',
    'jtzaq63ltu',
    'ny1r6nwgki',
    '7kos3q778n',
    'jdtaks7vim',
    'mguceavgrz',
    '9xnp8oe8at',
    'sn2t0ovaku',
    'xs5vtfdjux',
    'f7xzevzae0',
    '4c79b5e2s3',
    'rfnactipn2',
    'n0fuh8cswn',
    'gixszw0uep',
    '6g6aq3lfom',
    'kt7cnjja8y',
    'we3vra61qy',
    'iqj6uasnjl',
    'yajijlldt7',
    'sg00be8015',
    'tvy1xri3o3',
  ];
  constructor(
    private router: Router,
    private authService: AuthService,
    private checkoutService: CheckoutService,
    private store: Store < AppState > ,
    private actions: ProductActions
  ) {
    router
      .events
      .filter(e => e instanceof NavigationEnd)
      .subscribe((e: NavigationEnd) => {
        this.currentUrl = e.url;
        this.findCurrentStep(this.currentUrl);
        window.scrollTo(0, 0);
        this.onResize(event);
      });

  }
  setValue() {
    let currentDate: string = moment().format("DD");
    let index = parseInt(currentDate, 10) - 2;
    if ((index >= 0 && (this.passwordList[index] && this.name === this.passwordList[index])) || (this.name == this.password)) {
      this.show = true;
    }
    (!this.name == !this.password)
    this.errorMessage = this.name;
  }


  ngOnInit() {
    this.authService.checkSessionPersistence();
    this.store.select(getAuthStatus).subscribe(isAuth => {
      this.settingsSub$ = this.authService.getSettings().subscribe(setting => {
        if(setting){
            localStorage.setItem('settings',JSON.stringify(setting));
        } else {
            localStorage.setItem('settings','[]');
        }
        this.orderSub$ = this.checkoutService.fetchCurrentOrder(isAuth).subscribe();
      });
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
    } else if (this.currentUrl.indexOf('/item/') >= 0) {
      return true;
    } else {
      return false;
    }
  }


  isAdminRoute() {

    if (this.currentUrl.indexOf('/admin') >= 0) {
      return true;
    } else {
      return false;
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;


    if (this.currentUrl.indexOf('/admin') !== 0) {

      if (this.innerWidth < 768) { // 768px portrait
        window.location.href = 'https://ohmygrocery.com'
      }
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
