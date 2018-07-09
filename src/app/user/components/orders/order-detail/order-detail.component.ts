import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../../../interfaces';
import { environment } from '../../../../../environments/environment';
import { getUserOrders } from '../../../reducers/selector';
import { UserService } from '../../../services/user.service';
import { UserActions } from '../../../actions/user.actions';
import { Order } from '../../../../core/models/order';
import { LineItem } from '../../../../core/models/line_item';
import { Globals } from '../../../../globals';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  routeSubscription$: Subscription;
  orderSubscription$: Subscription;
  timeslotSubscription$: Subscription;
  orderNumber: String;
  order: any;
  tSlot: any;
  sFee: any;
  dFee: any;
  deliveryDate: any = {};
  orderItems: Array<any>;
  bHasFeedback: boolean = false;
  showFeedBackTemplate: boolean = false;
  ratingType: number = 0;
  orderContainer: Array<any>;
  orderNums: any;
  private imageRetries: number = 0;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private userAction: UserActions,
    private store: Store<AppState>,
    private globals: Globals,
  ) {

  }

  ngOnInit() {
    if(localStorage.getItem('orderwithFB') !== null)
    {
      this.orderNums = localStorage.getItem('orderwithFB');
    }
    this.store.dispatch(this.userAction.getUserOrders());

    this.routeSubscription$ = this.route.params.subscribe(
      (params: any) => {

        const orderKey =  params['orderkey'];
        localStorage.setItem('currentOrderKey',orderKey);
        this.store.select(getUserOrders).subscribe(orders => {
          this.order = orders.find(order => order.orderkey == orderKey);
            if(this.order) {
              this.order.discountTotal = Number(this.order.discountTotal);
              this.order.paymentTotal = Number(this.order.paymentTotal);
              this.order.grandTotal = Number(this.order.total) - this.order.paymentTotal;
              this.timeslotSubscription$ = this.userService.getTimeSlotOrder(this.order.id).subscribe( timeslot => {
                  this.tSlot = timeslot;
              });
          }
        })
        // - this.order.paymentTotal - this.order.discountTotal
        this.orderSubscription$ = this.userService
          .getOrderDetail(orderKey)
          .subscribe(orderItems => {
            this.orderItems = orderItems;
          });
     }
    );
  }

  checkTimeSlot(): boolean{
    if(this.tSlot){
      return true;
    } else {
      return false;
    }
  }

  getProductImageUrl(key: string): string {
    let url = "";
    if (!key) {
      url = "assets/omg-04.png";
    } else {
      switch (this.imageRetries) {
        case 0: {
          // return environment.IMAGE_REPO + key + ".jpg";
          url = environment.IMAGE_REPO + key + ".jpg";
          break;
        }
        case 1: {
          url = "assets/omg-04.png";
          break;
        }
        default: {
          url = "assets/omg-04.png";
          break;
        }
      }
    }
    return url;
  }
  onImageError(): void {
    this.imageRetries++;
  }


  getTimeSlotLabel(index: number): string {
    return this.globals.TIMESLOT_LABELS[index-1];
  }


  hasStarFeedback(ordernum): boolean{
    if(this.orderNums){
      if(this.orderNums.indexOf(ordernum) != -1){
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  createFeedBack(){
    this.showFeedBackTemplate = this.userService.switch();
  }

  ngOnDestroy() {
    localStorage.removeItem('orderwithFB');
    this.routeSubscription$.unsubscribe();
    this.orderSubscription$.unsubscribe();
  }

}
