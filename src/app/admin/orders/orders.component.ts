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
  orderSub: Subscription;
  orderIndex$: any;
  orderItems: any;
  itemList: any;

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit() {
    //NOTE: dummy ID
    const sellerId = 1;
    this.ordersSub = this.adminService.getSellerOrders(1).subscribe(order => {
      this.orders = order;
      if(localStorage.getItem('order') != ''){
        localStorage.removeItem('order');
        localStorage.removeItem('orderedItems');
      }
    } )
  }

  getOrder(index)
  {
    localStorage.setItem('order',JSON.stringify(this.orders[index]));
    this.orderSub = this.adminService.getOrderDetail(this.orders[index].orderkey).subscribe(orderItems =>
    {
      this.orderItems = orderItems;
      this.getOrderItems(this.orderItems);
    })


  }

  getOrderItems(orderedItems){
    this.itemList = orderedItems;
    localStorage.setItem('orderedList',JSON.stringify(this.itemList));
  }

  ngOnDestroy() {
    // this.ordersSub.unsubscribe();
    // localStorage.removeItem('order');
  }

}
