import { AppState } from './../../../interfaces';
import { Store } from '@ngrx/store';
import { getTotalCartValue, getTotalCartItems } from './../../reducers/selectors';
import { Observable } from 'rxjs/Observable';
import { Order } from './../../../core/models/order';
import { CheckoutService } from './../../../core/services/checkout.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-delivery-options',
  templateUrl: './delivery-options.component.html',
  styleUrls: ['./delivery-options.component.scss']
})
export class DeliveryOptionsComponent implements OnInit {

  @Input() orderNumber;
  order;
  selectedShippingRate;
  shippingRates = [];
  totalCartValue$: Observable<number>;
  totalCartItems$: Observable<number>;
  myForm: FormGroup;
  minDate: Date;
  currMonth: String;
  today: Date;
  dateToAdd: Date;
  locale = "en-us";

  constructor(private checkoutService: CheckoutService, private store: Store<AppState>, private formBuilder: FormBuilder) {
    this.totalCartValue$ = this.store.select(getTotalCartValue);
    this.totalCartItems$ = this.store.select(getTotalCartItems);
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 1);
  }

  ngOnInit() {
    this.today = new Date();
    this.currMonth = this.today.toLocaleString(this.locale,{month:"long"});
    this.currMonth = this.currMonth +' '+ this.today.getUTCDate();

    console.log('Delivery Date');
    console.log(this.currMonth);
  }

  onCalendarToggle(){
    this.today = new Date((new Date()).setDate(this.today.getDate() + 1));
    this.currMonth = this.today.toLocaleString(this.locale,{month:"long"});
    this.currMonth = this.currMonth +' '+ this.today.getUTCDate();
    console.log(this.currMonth);
  }

  private setOrder() {
    this.checkoutService.getOrder(this.orderNumber)
      .subscribe((order) => {
        this.order = order;
        this.setShippingRates();
      });
  }

  private setShippingRates() {
    this.shippingRates = this.order.shipments[0].shipping_rates;
    this.selectedShippingRate = this.order.shipments[0].selected_shipping_rate;
  }

}
