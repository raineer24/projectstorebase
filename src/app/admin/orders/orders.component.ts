import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AdminService } from './../services/admin.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: any;
  ordersSub: Subscription;
  orderSub: Subscription;
  orderItem$: Subscription;
  orderIndex$: any;
  orderItems: any;
  itemList: any;
  ordersShow: any;
  statusContainer: string[] = [];
  selected: string = "All";
  userData: any;

  constructor(
    private adminService: AdminService,
    private router: Router,
  ) { }

  ngOnInit() {
    //NOTE: dummy ID
    const sellerId = 0;
    this.ordersSub = this.adminService.getSellerOrders(sellerId).subscribe(order => {
      this.orders = order;
    });
    this.userData = JSON.parse(localStorage.getItem('selleruser'));
  }

  takeOrder(orderSeller: any) {
    const data = {
      id: orderSeller.id,
      selleraccount_id: this.userData.id,
      assembledBy: this.userData.id,
      updatedBy: this.userData.id,
      status: 'in-progress',
    }
    this.adminService.takeOrder(data).mergeMap(response => {
      if(response.message.indexOf('Updated') >= 0) {
        return this.adminService.updateOrder({
          id: orderSeller.order_id,
          status: 'in-progress',
        });
      } else {
        return Observable.empty();
      }
    }).subscribe(response => {
      if(response && response.message.indexOf('Updated') >= 0) {
        this.router.navigate(['/admin/orders/in-progress', orderSeller.id]);
      }
    })
  }

  deliverOrder(orderSeller: any): void {
    const data = {
      id: orderSeller.id,
      selleraccount_id: this.userData.id,
      deliveredBy: this.userData.id,
      updatedBy: this.userData.id,
      status: 'in-transit',
    }
    this.router.navigate(['/admin/orders/in-transit', orderSeller.id]);
  }

  refresh(): void {
    //NOTE: dummy ID
    const sellerId = 0;
    this.ordersSub = this.adminService.getSellerOrders(sellerId).subscribe(order => {
      this.orders = order;
    });
  }

  ngOnDestroy() {
    this.ordersSub.unsubscribe();
  }
}
