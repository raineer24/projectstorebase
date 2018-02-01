import { Router } from '@angular/router';
import { CheckoutService } from './../../core/services/checkout.service';
import { getShipAddress, getOrderState, getOrderNumber } from './../reducers/selectors';
import { AppState } from './../../interfaces';
import { Store } from '@ngrx/store';
import { Address } from './../../core/models/address';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit, OnDestroy {

  stateSub$: Subscription;
  orderState: string;
  orderNumber$: Observable<number>;
  shipAddress$: Observable<Address>;
  isShowDeliveryOption: boolean = false;

  constructor(
    private store: Store<AppState>,
    private checkoutService: CheckoutService,
    private router: Router
  ){
    this.orderNumber$ = this.store.select(getOrderNumber);
    this.shipAddress$ = this.store.select(getShipAddress);
    this.stateSub$ = this.store.select(getOrderState)
      .subscribe(state => this.orderState = state);
  }

  ngOnInit() {
  }

  checkoutToPayment() {
    // if (this.orderState === 'delivery' || this.orderState === 'address') {
    //   this.checkoutService.changeOrderState()
    //     .do(() => {
    //       this.router.navigate(['/checkout', 'payment']);
    //     })
    //     .subscribe();
    // } else {
   this.router.navigate(['/checkout', 'payment']);
    // }
  }

  toggleShowDeliveryDateOption($event){
    this.isShowDeliveryOption = true;
    //this.checkoutService.updateOrder().subscribe();
    console.log("Shows Delivery Date/Time page!");
  }

  toggleShowDeliveryAddressOption(){
    this.isShowDeliveryOption = false;
  }

  ngOnDestroy() {
    if (this.orderState === 'delivery') {
      this.checkoutService.changeOrderState()
        .subscribe();
    }
    this.stateSub$.unsubscribe();
  }

}
