import { Component, OnInit, Input, QueryList, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AppState } from './../../../interfaces';
import { getOrderId, getOrderState, getDeliveryDate } from './../../reducers/selectors';
import { CheckoutActions } from './../../actions/checkout.actions';
import { CheckoutService } from './../../../core/services/checkout.service';
import { Globals } from './../../../globals';


@Component({
  selector: 'app-delivery-options',
  templateUrl: './delivery-options.component.html',
  styleUrls: ['./delivery-options.component.scss']
})
export class DeliveryOptionsComponent implements OnInit {
  private componentDestroyed: Subject<any> = new Subject();
  @Output() onBackClickEmit: EventEmitter<string> = new EventEmitter();
  @Input() orderId: number;
  @Input() orderStatus: string;
  @Input() deliveryDate: any = {};
  selectedDateIndex: number;
  timeSlots: Array<any>;
  availableSlots: Array<any>;
  timeSlotRows: Array<any>;
  selectedTimeSlot: Array<number> = [null, null];
  isShowErrMsg: boolean = false;
  BUFFER_HOUR: number = 3;

  constructor(
    private checkoutAction: CheckoutActions,
    private checkoutService: CheckoutService,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private router: Router,
    private globals: Globals,
  ) {
    this.checkoutService.getAllTimeSlot().takeUntil(this.componentDestroyed).subscribe(data => {
      this.timeSlots = data;
      this.timeSlotRows = this.timeSlots[0].range;
      const i = this.timeSlots.findIndex(day => day.date === this.deliveryDate.date);
      // TEMPORARY
      //this.timeSlots[5].range[2].booked = 5;
      // console.log(this.timeSlots)
      // this.selectedTimeSlot =[7,3];
      if(i >= 0){
        const j = this.timeSlots[i].range.findIndex(slot =>
           Number(slot.timeslotId) === Number(this.deliveryDate.timeslotId));

        if(j >= 0) {
          const slot = this.timeSlots[i].range[j];
          if(slot.booked < slot.max && !this.isClosedSlot(i,j)) {
            this.selectedTimeSlot = [i, j];
          }
        }
      }
    });
  }

  ngOnInit() {
    // TODO: check if user has order
    // console.log(this.orderStatus)
    // if(this.orderStatus == 'timeslot'
    // || this.orderStatus == 'payment') {
    //   //do nothing;
    // } else {
    //   this.router.navigate(['/']);
    // }
  }

  onBackBtn() {
    this.onBackClickEmit.emit();
  }

  isClosedSlot(i,j) {
    if(i != 0) {
      return false;
    }
    // NOTE: 3 hour buffer
    // let timeslot = new Date(`${this.timeSlots[i].date} ${this.timeSlots[i].range[j].range}`);
    // timeslot.setHours(timeslot.getHours() - this.BUFFER_HOUR);
    // const now = new Date();
    // if(now < timeslot) {
    //   return false;
    // } else {
    //   return true;
    // }
    // NOTE: 1 day buffer
    if(new Date(this.timeSlots[i].date).setHours(0,0,0,0) == new Date().setHours(0,0,0,0)) {
      return true;
    } else {
      return false;
    }
  }

  checkoutToPayment() {
    const i = this.selectedTimeSlot[0];
    const j = this.selectedTimeSlot[1];
    if(i != null) {
      this.isShowErrMsg = false;
      this.checkoutService.getAllTimeSlot().subscribe(data => {
        if (data[i].range[j].booked < data[i].range[j].max) {
          let datetime = new Date(this.timeSlots[i].date);
          datetime.setHours(5 + (Number(this.timeSlots[i].range[j].timeslotId) * 3));
          this.store.dispatch(this.checkoutAction.updateOrderDeliveryOptionsSuccess({
            status: 'timeslot',
            date: {
              date: this.timeSlots[i].date,
              timeslotId: Number(this.timeSlots[i].range[j].timeslotId),
              datetime: datetime.getTime(),
            },
          }));
          this.router.navigate(['/checkout', 'payment']);
        } else {
          this.timeSlots = data;
          this.selectedTimeSlot = [null, null];
          this.checkoutService.showErrorMsg('timeslot','');
        }
      });
      // let params:any = {};
      // params = {
      //     'order_id': Number(this.orderId),
      //     'timeslot_id': Number(this.timeSlots[i].range[j].timeslotId),
      //     'date': this.timeSlots[i].date
      //   };
      // this.checkoutService.getTimeSlotOrder(this.orderId).mergeMap(res => {
      //   if(res.message){
      //     return this.checkoutService.setTimeSlotOrder(params);
      //   } else {
      //     return this.checkoutService.updateTimeSlotOrder(params);
      //   }
      // }).mergeMap((res) => {
      //   if(res.message == 'Slot is full') {
      //     return this.checkoutService.getAllTimeSlot().map(data => {
      //       this.timeSlots = data;
      //       this.selectedTimeSlot = [null, null];
      //       this.checkoutService.showErrorMsg('timeslot','');
      //     });
      //   } else {
      //     params = {
      //       status: 'timeslot'
      //     }
      //     this.router.navigate(['/checkout', 'payment']);
      //     return this.checkoutService.updateOrder(params);
      //   }
      // }).subscribe();
    } else {
      this.checkoutService.showErrorMsg('timeslot','');
    }
    localStorage.setItem('confirmationPayment','');
    // localStorage.setItem('payment','');
    // localStorage.setItem('voucher','');
    // localStorage.setItem('giftcert','');
    // localStorage.setItem('discount','');
  }

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.unsubscribe();
  }

}
