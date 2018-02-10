import { Router, ActivatedRoute } from '@angular/router';
import { CheckoutService } from './../../core/services/checkout.service';
import { getOrderState, getOrderId, getDeliveryDate } from './../reducers/selectors';
import { AppState } from './../../interfaces';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit, OnDestroy {

  statusSub$: Subscription;
  orderStatus: string;
  isShowDeliveryOption: boolean = false;
  orderId$: Observable<number>;
  orderStatus$: Observable<string>;
  deliveryDate$: Observable<any>;

  constructor(
    private store: Store<AppState>,
    private checkoutService: CheckoutService,
    private router: Router,
    private route: ActivatedRoute
  ){
    this.orderId$ = this.store.select(getOrderId);
    this.orderStatus$ = this.store.select(getOrderState);
    this.deliveryDate$ = this.store.select(getDeliveryDate);
  }

  ngOnInit() {
    const isDeliveryOption = this.route.snapshot.paramMap.get('deliveryOptions');
    if(isDeliveryOption != null)
        this.isShowDeliveryOption = true;
  }


  toggleShowDeliveryDateOption($event){
    this.isShowDeliveryOption = true;
    this.router.navigate(['/checkout', 'address', {deliveryOptions: true}]);
  }

  toggleShowDeliveryAddressOption(){
    this.isShowDeliveryOption = false;
    this.router.navigate(['/checkout', 'address']);
  }

  ngOnDestroy() {
  }

}
