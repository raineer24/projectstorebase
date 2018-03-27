import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../../environments/environment';
import { AdminService } from '../../../services/admin.service';
import { CheckoutService } from '../../../../core/services/checkout.service';
import { UserService } from '../../../../user/services/user.service';
import { UserActions } from '../../../../user/actions/user.actions';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  routeSubscription$: Subscription;
  orderSeller: any;
  orderItems: Array<any> = [];
  orderItemStatus: Array<any> = [];
  MIN_VALUE = 1;
  MAX_VALUE = 9999;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private checkoutService: CheckoutService
  ) { }

  ngOnInit() {
    this.routeSubscription$ = this.route.params.subscribe(
      (params: any) => {

        const orderSellerId =  params['id'];
        this.adminService.getSellerOrder(orderSellerId).mergeMap(orderSeller => {
          this.orderSeller = orderSeller;
          return this.adminService.getOrderItems(orderSeller.order_id).map(orderItems => {
          // NOTE: TEMPORARY ORDER ID 0
          // return this.adminService.getOrderItems(0).map(orderItems => {
            this.orderItems = orderItems
            orderItems.forEach(x => {
              this.orderItemStatus[x.orderItem_id] = x.processed;
            })
            return orderItems;
          })
        }).subscribe();
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

  incrementQuantity(index: number): void {
    if (this.orderItems[index].quantity < this.MAX_VALUE) {
      this.orderItems[index].quantity++;
    }
  }

  decrementQuantity(index: number): void {
    if (this.orderItems[index].quantity > this.MIN_VALUE) {
      this.orderItems[index].quantity--;
    }
  }

  confirm(orderItem: any): void {
    orderItem.status = "confirmed";
    this.adminService.updateOrderItem(orderItem).subscribe();
  }

  unavailable(orderItem: any): void {
    orderItem.status = "unavailable";
    this.adminService.updateOrderItem(orderItem).subscribe();
  }

  finalize() {

  }

}
