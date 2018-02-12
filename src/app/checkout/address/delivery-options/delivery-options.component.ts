import { AppState } from './../../../interfaces';
import { Store } from '@ngrx/store';
import { getOrderId, getOrderState, getDeliveryDate } from './../../reducers/selectors';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { CheckoutService } from './../../../core/services/checkout.service';
import { CheckoutActions } from './../../actions/checkout.actions';
import { Component, OnInit, Input, ViewChildren, QueryList, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-delivery-options',
  templateUrl: './delivery-options.component.html',
  styleUrls: ['./delivery-options.component.scss']
})
export class DeliveryOptionsComponent implements OnInit {
  @Output() onBackClickEmit: EventEmitter<string> = new EventEmitter();
  @Input() orderId: number;
  @Input() orderStatus: string;
  @Input() deliveryDate: any = {};
  selectedDateIndex: number;
  timeSlots: Array<any>;
  availableSlots: Array<any>;
  timeSlotRows: Array<any>;
  timeSlotLabels: Array<string> = ['8:00AM - 11:00AM','11:00AM - 2:00PM','2:00PM - 5:00PM','5:00PM - 8:00PM'];
  radioModel: Array<number> = [null, null];
  prevIndex: number;
  prevSlot: any;
  isShowErrMsg: boolean = false;

  @ViewChildren("radioButtons") radioModels: QueryList<any>;
  private componentDestroyed: Subject<any> = new Subject();

  constructor(
    private checkoutAction: CheckoutActions,
    private checkoutService: CheckoutService,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
      this.checkoutService.getAllTimeSlot().takeUntil(this.componentDestroyed).subscribe(data => {
        this.timeSlots = data;
        this.timeSlotRows = this.timeSlots[0].range;
        const i = this.timeSlots.findIndex(day => day.date === this.deliveryDate.date);
        // TEMPORARY
        this.timeSlots[5].range[2].booked = 5;
        // console.log(this.timeSlots)
        // this.radioModel =[7,3];

        if(i >= 0){
          const j = this.timeSlots[i].range.findIndex(slot =>
             Number(slot.timeslotId) === Number(this.deliveryDate.timeslotId));

          if(j >= 0) {
            const slot = this.timeSlots[i].range[j];
            if(slot.booked < slot.max && !this.isPastTime(i,j)) {
              this.radioModel = [i, j];
            }
          }
        }
      });

  }

  ngOnInit() {
    // console.log(this.orderStatus)
    // if(this.orderStatus == 'delivery'
    // || this.orderStatus == 'payment') {
    //   //do nothing;
    // } else {
    //   this.router.navigate(['/']);
    // }
  }

  selectSlot(event: any){
    if(event.target.classList.contains('btn-success')) {
      const i = this.radioModel[0];
      const j = this.radioModel[1];
      const index = (j * 8) + i;
      if (index != this.prevIndex) {
        const buttons = this.radioModels.toArray();
        const slot = this.timeSlots[i].range[j];

        buttons[index].nativeElement.textContent = "SELECTED"//((slot.max - slot.booked) - 1);

        if(this.prevIndex != null)
          buttons[this.prevIndex].nativeElement.textContent = "Available";//(this.prevSlot.max - this.prevSlot.booked);

        this.prevSlot = slot;
        this.prevIndex = index;
      }
    }
  }

  onBackBtn() {
    this.onBackClickEmit.emit();
  }

  isPastTime(i,j) {
    if(i != 0) {
      return false;
    }
    const range = this.timeSlots[i].range[j].range.split('to');
    const today = new Date().getHours();
    if(today < Number.parseInt(range[0])) {
      return false;
    } else {
      return true;
    }
  }

  checkoutToPayment() {
    const i = this.radioModel[0];
    const j = this.radioModel[1];
    if(i != null) {
      this.isShowErrMsg = false;
      let params:any = {};
      params = {
          'order_id': Number(this.orderId),
          'timeslot_id': Number(this.timeSlots[i].range[j].timeslotId),
          'date': this.timeSlots[i].date
        };
      this.checkoutService.getTimeSlotOrder(this.orderId).mergeMap(res => {
        if(res.message){
          return this.checkoutService.setTimeSlotOrder(params);
        } else {
          return this.checkoutService.updateTimeSlotOrder(params);
        }
      }).mergeMap((res) => {
        params = {
          status: 'delivery'
        }
        console.log(params)
        return this.checkoutService.updateOrder(params);
        //this.store.dispatch(this.checkoutAction.updateOrderDeliveryOptionsSuccess(params));
      }).subscribe();

      this.router.navigate(['/checkout', 'payment']);
    } else {
      this.isShowErrMsg = true;
    }
  }

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.unsubscribe();
  }

}
