import { Component, OnInit, ViewChild } from '@angular/core';
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
  isCancelReason: boolean = false;
  @ViewChild('cancelModal') cancelModal;

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
              item.price = Number(item.price);
              item.finalQuantity = item.finalQuantity ? Number(item.finalQuantity) : item.quantity;
              item.finalPrice = item.finalPrice ? Number(item.finalPrice): item.price;
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
    orderItem.status = 'confirmed';
    const data = {
      id: orderItem.orderItem_id,
      item_id: orderItem.id,
      quantity: orderItem.quantity,
      finalQuantity: orderItem.finalQuantity,
      finalPrice: orderItem.finalPrice,
      status: 'confirmed',
    }
    this.recalculate();
    this.adminService.updateOrderItem(data).subscribe();
  }

  unavailable(orderItem: any): void {
    orderItem.status = 'unavailable';
    const data = {
      id: orderItem.orderItem_id,
      item_id: orderItem.id,
      quantity: orderItem.quantity,
      finalQuantity: '',
      finalPrice: '',
      status: 'unavailable',
    }
    this.recalculate();
    this.adminService.updateOrderItem(data).subscribe();
  }

  reset(orderItem: any): void {
    this.orderItemStatus[orderItem.orderItem_id] = 0;
    orderItem.status = 'ordered';
    orderItem.finalQuantity = orderItem.quantity;
    orderItem.finalPrice = orderItem.price;
    const data = {
      id: orderItem.orderItem_id,
      item_id: orderItem.id,
      quantity: orderItem.quantity,
      finalQuantity: '',
      finalPrice: '',
      status: 'ordered',
    }
    this.recalculate();
    this.adminService.updateOrderItem(data).subscribe();
  }

  updatePrice(e: any, orderItem: any): void {
    const value = Number(e.srcElement.value);
    if(isNaN(value)) {
      e.srcElement.value = orderItem.price;
    } else {
      orderItem.finalPrice = value;
    }
  }

  forwardToDelivery(): void {
    const data = {
      order: {
        id: this.orderSeller.order_id,
        finalTotal: this.itemsTotal,
        finalQuantity: this.itemsQuantity,
        status: 'assembled',
      },
      orderseller: {
        id: this.orderSeller.id,
        selleraccount_id: 0,
        status: 'assembled',
        updatedBy: this.userData.id,
      }
    }
    this.adminService.updateSellerOrder(data.orderseller).mergeMap(() => {
      return this.adminService.updateOrder(data.order)
    }).subscribe(res => {
      if(res.message.indexOf('Updated') >= 0) {
        this.router.navigate(['/admin/orders']);
      }
    });
  }

  cancelOrder(comments: string): void {
    if(!comments) {
      this.isCancelReason = true;
    } else {
      const data = {
        id: this.orderSeller.id,
        selleraccount_id: 0,
        updatedBy: this.userData.id,
        status: 'cancelled',
        comments: comments
      }
      this.cancelModal.hide();
      this.adminService.updateSellerOrder(data).subscribe(res => {
        if(res.message.indexOf('Updated') >= 0) {
          this.router.navigate(['/admin/orders']);
        }
      });
    }
  }

  recalculate(): void {
    this.itemsConfirmed = 0;
    this.itemsUnavailable = 0;
    this.itemsQuantity = 0;
    this.itemsTotal = 0;
    this.orderItems.forEach(item => {
      switch (item.status) {
        case 'confirmed':
          this.itemsConfirmed++;
          this.itemsQuantity += Number(item.finalQuantity);
          this.itemsTotal += Number(item.finalQuantity) * Number(item.finalPrice);
          break;
        case 'unavailable':
          this.itemsUnavailable++;
          break;
      }
    });
  }

}
