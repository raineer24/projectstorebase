import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../../environments/environment';
import { AdminService } from '../../../services/admin.service';
import { CheckoutService } from '../../../../core/services/checkout.service';
import { UserService } from '../../../../user/services/user.service';
import { UserActions } from '../../../../user/actions/user.actions';


@Component({
  selector: 'app-order-deliver',
  templateUrl: './order-deliver.component.html',
  styleUrls: ['./order-deliver.component.scss']
})
export class OrderDeliverComponent implements OnInit {
  routeSubscription$: Subscription;
  orderSeller: any;
  orderItems: Array<any> = [];
  userData: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private checkoutService: CheckoutService
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('selleruser'));
    this.routeSubscription$ = this.route.params.subscribe(
      (params: any) => {
        const orderSellerId = params['id'];
        this.adminService.getSellerOrder(orderSellerId).mergeMap(orderSeller => {
          this.orderSeller = orderSeller;
          console.log(orderSeller);
          // if(orderSeller.selleraccount_id != this.userData.id) {
          //   this.router.navigate(['/admin/order-assemble']);
          //   return Observable.empty();
          // }
          return this.adminService.getOrderItems(orderSeller.order_id).map(orderItems => {
            this.orderItems = orderItems
            return orderItems;
          })
        }).subscribe();
      }
    );
  }

  ngOnDestroy() {
    this.routeSubscription$.unsubscribe();
  }

  completeOrder(): void {
    this.orderSeller.status = 'complete';
    const data = {
      id: this.orderSeller.id,
      selleraccount_id: 0,
      status: 'complete',
      updatedBy: this.userData.id,
      dateCompleted: new Date().getTime(),
    }
    this.adminService.updateSellerOrder(data).mergeMap(response => {
      if(response.message.indexOf('Updated') >= 0) {
        return this.adminService.updateOrder({
          id: this.orderSeller.order_id,
          status: 'complete',
        });
      } else {
        return Observable.empty();
      }
    }).subscribe(response => {
      if(response && response.message.indexOf('Updated') >= 0) {
        this.router.navigate(['/admin/order-assemble']);
      }
    })
  }

  returnOrder(): void {
    this.orderSeller.status = 'returned';
    const data = {
      id: this.orderSeller.id,
      selleraccount_id: 0,
      status: 'returned',
      updatedBy: this.userData.id,
    }
    this.adminService.updateSellerOrder(data).mergeMap(response => {
      if(response.message.indexOf('Updated') >= 0) {
        return this.adminService.updateOrder({
          id: this.orderSeller.order_id,
          status: 'returned',
        });
      } else {
        return Observable.empty();
      }
    }).subscribe()
  }

  returnComplete(): void {
    this.orderSeller.status = 'returned-complete';
    const data = {
      id: this.orderSeller.id,
      selleraccount_id: 0,
      status: 'returned-complete',
      updatedBy: this.userData.id,
      dateCompleted: new Date().getTime(),
    }
    this.adminService.updateSellerOrder(data).mergeMap(response => {
      if(response.message.indexOf('Updated') >= 0) {
        return this.adminService.updateOrder({
          id: this.orderSeller.order_id,
          status: 'returned-complete',
        });
      } else {
        return Observable.empty();
      }
    }).subscribe()
  }
}
