import { AppState } from './../../../interfaces';
import { Store } from '@ngrx/store';
import { getTotalCartValue, getTotalCartItems } from './../../reducers/selectors';
import { Observable } from 'rxjs/Observable';
import { Order } from './../../../core/models/order';
import { CheckoutService } from './../../../core/services/checkout.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';


@Component({
  selector: 'app-delivery-options',
  templateUrl: './delivery-options.component.html',
  styleUrls: ['./delivery-options.component.scss']
})
export class DeliveryOptionsComponent implements OnInit {

  @Input() orderNumber;
  order;
  selectedShippingRate;
  allTimeSlots;
  timeSlots;
  shippingRates = [];
  myForm: FormGroup;
  currMonth: String;
  today: Date;
  dateToAdd: Date;
  dispMonth: string;
  slotNum: string;
  availableSlots: Array<any>;
  aSlots: Array<any>;
  varLoop: number;
  slotFull: boolean;
  lastDay: number;
  isShowDeliveryOption: boolean = false;
  timeSlots$: Observable<any>;
  timeSlotRows: Array<any>;
  timeSlotLabels: Array<string> = ['8:00AM - 11:00AM','11:01AM - 2:00PM','2:01PM - 5:00PM','5:01PM - 8:00PM'];
  radioModel: string;

  constructor(
    private checkoutService: CheckoutService,
    private store: Store<AppState>,
    private formBuilder: FormBuilder
  ) {
      this.timeSlots$ = this.checkoutService.getAllTimeSlot();
      this.checkoutService.getAllTimeSlot().subscribe(data => {
        console.log(data)
        this.timeSlots = data;
        this.timeSlotRows = this.timeSlots[0].range;
        console.log(this.timeSlotRows)
      });
  }

  ngOnInit() {
    //this.getAllTimeSlot();
    this.slotFull = false;

    var lDay = moment().daysInMonth();
    this.lastDay =  lDay;
  }

  private getAllTimeSlot(){
      var ctr = 0;
      this.aSlots = [5];

      // this.checkoutService.getAllTimeSlot().subscribe( data => {
      //   console.log(data)
      //   this.timeSlots = data;
      //   this.availableSlots = data;
      //   // arrSlot = this.availableSlots[0];
      //       this.aSlots = this.availableSlots[ctr].range;
      //   // this.availableSlots = JSON.stringify(this.availableSlots);
      //   // for(var key in this.aSlots)
      //   // {
      //   //   console.log(this.aSlots);
      //   // }
      // });
  }

  counter(i: number) {
    return new Array(i);
  }

  sevenDays(n: number){
    var dNow = moment(new Date()).format('MMM DD');
    var daysArr = new Array;
    for(var ctr=0; ctr < n; ctr++)
    {
      if(ctr==0)
        daysArr[ctr] = dNow;
      else{
        daysArr[ctr] = moment(dNow,'mm-dd').add(ctr,'days').format('MMM DD');
      }
    }
    return daysArr;
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

  toggleShowDeliveryAddressOption(){
    this.isShowDeliveryOption = false;
  }

}
