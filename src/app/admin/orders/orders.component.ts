import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AdminService } from './../services/admin.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: any;
  ordersSub: Subscription;

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit() {
    //NOTE: dummy ID
    const sellerId = 1;
    this.ordersSub = this.adminService.getSellerOrders(sellerId).subscribe(order => this.orders)
  }

  ngOnDestroy() {
    this.ordersSub.unsubscribe();
  }

}
