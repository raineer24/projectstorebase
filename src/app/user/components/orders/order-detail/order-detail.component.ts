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


@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  routeSubscription$: Subscription;
  orderSubscription$: Subscription;
  orderNumber: String;
  order: any;
  orderItems: Array<any>
  fees: Object;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
  }

  ngOnInit() {
    //NOTE: TEMPORARY!!! FEES TO BE DECIDED
    this.fees = {
      service: 100,
      delivery: 100,
    };
    this.routeSubscription$ = this.route.params.subscribe(
      (params: any) => {
        const orderKey =  params['orderkey'];
        this.store.select(getUserOrders).subscribe(orders => {
          this.order = orders.find(order => order.orderkey == orderKey);
          if(this.order) {
            this.order.discountTotal = Number(this.order.discountTotal);
            this.order.paymentTotal = Number(this.order.paymentTotal);
            this.order.grandTotal = Number(this.order.total) - this.order.paymentTotal - this.order.discountTotal;
          }
        })

        this.orderSubscription$ = this.userService
          .getOrderDetail(orderKey)
          .subscribe(orderItems => {
            this.orderItems = orderItems;
          });
     }
    );
  }

  getProductImageUrl(key: string): string {
    let url = "";
    if (!key) {
      url = "assets/omg-04.png";
    } else {
      url = environment.IMAGE_REPO + key + ".jpg";
    }
    return url;
  }

  ngOnDestroy() {
    this.routeSubscription$.unsubscribe();
    this.orderSubscription$.unsubscribe();
  }

}
