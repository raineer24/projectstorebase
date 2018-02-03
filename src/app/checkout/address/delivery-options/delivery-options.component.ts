import { AppState } from './../../../interfaces';
import { Store } from '@ngrx/store';
import { getTotalCartValue, getTotalCartItems } from './../../reducers/selectors';
import { Observable } from 'rxjs/Observable';
import { Order } from './../../../core/models/order';
import { CheckoutService } from './../../../core/services/checkout.service';
import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
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

  availableSlots: Array<any>;
  aSlots: Array<any>;
  isShowDeliveryOption: boolean = false;
  timeSlotRows: Array<any>;
  timeSlotLabels: Array<string> = ['8:00AM - 11:00AM','11:01AM - 2:00PM','2:01PM - 5:00PM','5:01PM - 8:00PM'];
  radioModel: Array<any> = [0,0];
  prevIndex: number;
  prevSlot: any;
  @ViewChildren("radioButtons") radioModels: QueryList<any>;

  constructor(
    private checkoutService: CheckoutService,
    private store: Store<AppState>,
    private formBuilder: FormBuilder
  ) {
      this.checkoutService.getAllTimeSlot().subscribe(data => {
        this.timeSlots = data;
        this.timeSlotRows = this.timeSlots[0].range;
// TEMPORARY
        console.log(data)
        this.timeSlots[0].range[1].booked = 5;
        console.log(this.timeSlotRows)
      });
  }

  ngOnInit() {
  }

  selectSlot(){
      const i = this.radioModel[0];
      const j = this.radioModel[1];
      const index = (j * 8) + i;

      if (index != this.prevIndex) {
        const buttons = this.radioModels.toArray();
        const slot = this.timeSlots[i].range[j];

        if (slot.max != slot.booked) {
          console.log(index);
          console.log(buttons[index]);

          const slot = this.timeSlots[i].range[j];
          buttons[index].nativeElement.textContent = ((slot.max - slot.booked) - 1);

          if(this.prevIndex != null)
            buttons[this.prevIndex].nativeElement.textContent = (this.prevSlot.max - this.prevSlot.booked)

          this.prevSlot = slot;
          this.prevIndex = index;
        }
    }
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
