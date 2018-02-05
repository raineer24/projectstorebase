import { AppState } from './../../../interfaces';
import { Store } from '@ngrx/store';
import { getOrderId, getOrderState } from './../../reducers/selectors';
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
  timeSlots: Array<any>;
  orderId: number;
  orderStatus: string;
  availableSlots: Array<any>;
  timeSlotRows: Array<any>;
  timeSlotLabels: Array<string> = ['8:00AM - 11:00AM','11:01AM - 2:00PM','2:01PM - 5:00PM','5:01PM - 8:00PM'];
  radioModel: Array<number> = [null,null];
  prevIndex: number;
  prevSlot: any;
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
// TEMPORARY
        // console.log(data)
        // this.timeSlots[3].range[1].booked = 5;
        // console.log(this.timeSlotRows)
      });
      this.store.select(getOrderId).takeUntil(this.componentDestroyed).subscribe(id => this.orderId = id);
      this.store.select(getOrderState).takeUntil(this.componentDestroyed).subscribe(state => this.orderStatus = state);
  }

  ngOnInit() {
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
    if(today < Number.parseInt(range[1])) {
      return false;
    } else {
      return true;
    }
  }

  checkoutToPayment() {
    const i = this.radioModel[0];
    const j = this.radioModel[1];
    if(i != null) {
      this.checkoutService.setTimeSlotOrder({
          'order_id': this.orderId,
          'timeslot_id': this.timeSlots[i].range[j].timeslotId,
          'date': this.timeSlots[i].date
        }).do(() => {
          this.store.dispatch(this.checkoutAction.updateOrderSuccess({status: 'payment'}));
      }).subscribe();
      this.router.navigate(['/checkout', 'payment']);
    }
  }

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.unsubscribe();
  }

}
