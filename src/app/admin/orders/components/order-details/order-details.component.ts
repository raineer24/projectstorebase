import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../../environments/environment';
import { AdminService } from '../../../services/admin.service';
import { UserService } from '../../../../user/services/user.service';
import { UserActions } from '../../../../user/actions/user.actions';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  routeSubscription$: Subscription;
  order: any;
  orderItems: Array<any> = [];

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.routeSubscription$ = this.route.params.subscribe(
      (params: any) => {

        const orderId =  params['id'];
        //NOTE: retrieve orderseller, order, orderItems


        // this.store.select(getUserOrders).subscribe(orders => {
        //   this.order = orders.find(order => order.orderkey == orderKey);
        //     if(this.order) {
        //       console.log(this.order.id);
        //       this.order.discountTotal = Number(this.order.discountTotal);
        //       this.order.paymentTotal = Number(this.order.paymentTotal);
        //       this.order.grandTotal = Number(this.order.total) - this.order.paymentTotal - this.order.discountTotal;
        //       console.log(this.order.grandTotal);
        //       this.timeslotSubscription$ = this.userService.getTimeSlotOrder(this.order.id).subscribe( timeslot => {
        //           this.tSlot = timeslot;
        //       });
        //   }
        // })
        //
        // this.orderSubscription$ = this.userService
        //   .getOrderDetail(orderKey)
        //   .subscribe(orderItems => {
        //     this.orderItems = orderItems;
        //   });
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

}
