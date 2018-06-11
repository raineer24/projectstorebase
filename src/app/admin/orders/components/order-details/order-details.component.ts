import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  itemsQuantity: number = 0;
  itemsTotal: number = 0;
  itemsConfirmed: number = 0;
  itemsUnavailable: number = 0;
  userData: any;
  MIN_VALUE = 1;
  MAX_VALUE = 9999;

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
          if(orderSeller.selleraccount_id != this.userData.id) {
            this.router.navigate(['/admin/orders']);
            return Observable.empty();
          }
          return this.adminService.getOrderItems(orderSeller.order_id).map(orderItems => {
            // NOTE: TEMPORARY ORDER ID 0
            // return this.adminService.getOrderItems(0).map(orderItems => {
            this.orderItems = orderItems
            orderItems.forEach((item, index) => {
              item.quantity = Number(item.quantity);
              item.finalQuantity = item.finalQuantity ? Number(item.finalQuantity) : item.quantity;
              this.orderItemStatus[item.orderItem_id] = item.status;
              switch (item.status) {
                case 'confirmed':
                  this.itemsConfirmed++;
                  this.itemsQuantity += Number(item.finalQuantity);
                  this.itemsTotal += Number(item.finalQuantity) * Number(item.price);
                  break;
                case 'unavailable':
                  this.itemsUnavailable++;
                  break;
              }
            })
            console.log(orderItems);
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
    if (this.orderItems[index].finalQuantity < this.MAX_VALUE) {
      this.orderItems[index].finalQuantity++;
    }
  }

  decrementQuantity(index: number): void {
    if (this.orderItems[index].finalQuantity > this.MIN_VALUE) {
      this.orderItems[index].finalQuantity--;
    }
  }

  confirm(orderItem: any): void {
    orderItem.status = "confirmed";
    this.recalculate();
    this.adminService.updateOrderItem(orderItem).subscribe();
  }

  unavailable(orderItem: any): void {
    // orderItem.finalQuantity = 0;
    orderItem.status = "unavailable";
    this.recalculate();
    this.adminService.updateOrderItem(orderItem).subscribe();
  }

  reset(orderItem: any): void {
    this.orderItemStatus[orderItem.orderItem_id] = 0;
    orderItem.status = 'ordered';
    orderItem.finalQuantity = orderItem.quantity;
    this.recalculate();
    this.adminService.updateOrderItem(orderItem).subscribe();
  }

  finalize() {
    this.orderSeller.finalTotal = this.itemsTotal;
    this.orderSeller.finalQuantity = this.itemsQuantity;
    this.adminService.finalizeOrder(this.orderSeller).subscribe();
  }

  recalculate() {
    this.itemsConfirmed = 0;
    this.itemsUnavailable = 0;
    this.itemsQuantity = 0;
    this.itemsTotal = 0;
    this.orderItems.forEach(item => {
      switch (item.status) {
        case 'confirmed':
          this.itemsConfirmed++;
          this.itemsQuantity += Number(item.finalQuantity);
          this.itemsTotal += Number(item.finalQuantity) * Number(item.price);
          break;
        case 'unavailable':
          this.itemsUnavailable++;
          break;
      }
    });
  }

}
