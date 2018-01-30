import { getOrderState } from './../../../reducers/selectors';
import { Router } from '@angular/router';
import { CheckoutService } from './../../../../core/services/checkout.service';
import { CheckoutActions } from './../../../actions/checkout.actions';
import { AppState } from './../../../../interfaces';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-order-total-summary',
  templateUrl: './order-total-summary.component.html',
  styleUrls: ['./order-total-summary.component.scss']
})
export class OrderTotalSummaryComponent implements OnInit, OnDestroy {

  stateSub$: Subscription;
  orderStatus: string;
  @Input() totalCartValue: number;
  @Input() totalCartItems: number;


  constructor(private store: Store<AppState>,
    private actions: CheckoutActions,
    private checkoutService: CheckoutService,
    private router: Router) {
    this.stateSub$ = this.store.select(getOrderState).subscribe(state => this.orderStatus = state);
  }

  ngOnInit() {
  }

  placeOrder() {

    if (this.orderStatus === 'cart') {
      this.checkoutService.updateOrder({
        'status': 'address',
        'totalQuantity': this.totalCartItems,
        'total': this.totalCartValue
      })
        .do(() => {
          this.router.navigate(['/checkout', 'address']);
        })
        .subscribe();
    } else {
      this.checkoutService.updateOrder({
        'totalQuantity': this.totalCartItems,
        'total': this.totalCartValue
      })
        .do(() => {
          this.router.navigate(['/checkout', 'address']);
        })
        .subscribe();
    }
  }

  ngOnDestroy() {
    this.stateSub$.unsubscribe();
  }
}
