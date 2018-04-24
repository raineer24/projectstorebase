import { Component, OnInit, OnDestroy } from '@angular/core';
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
  orderIndex$: any;
  orderItems: any;
  itemList: any;
  ordersShow: any;
  statusContainer: string[] = [];
  selected: string = "All";

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit() {
    //NOTE: dummy ID
    const sellerId = 0;
    this.ordersSub = this.adminService.getSellerOrders(sellerId).subscribe(order => {
      this.orders = order;
      var i: number;
      for(i=0; i < this.orders.length; i++){
        if(this.orders[i].status === 'pending'){
          console.log(this.orders[i]);
        }
        if(this.statusContainer.length == 0){
          this.statusContainer.push(this.orders[i].status);
        } else {
          if(!this.statusContainer.includes(this.orders[i].status)){
            this.statusContainer.push(this.orders[i].status);
          }
        }
      }
      const jsonData = JSON.stringify(this.orders);
      localStorage.setItem('sellerorders',jsonData);
      this.ordersShow = JSON.parse(localStorage.getItem('sellerorders'));
    } )
  }

  filterStatus(status){
    var i = 0;
    var filteredOrders = [];
    this.ordersShow = JSON.parse(localStorage.getItem('sellerorders'));

    if(status != 'All') {
      for(i=0; i < this.ordersShow.length; i++){
        if(this.ordersShow[i].status === status){
          filteredOrders.push(this.ordersShow[i]);
        }
      }
      localStorage.setItem('sellerorders_filtered',JSON.stringify(filteredOrders))
      this.ordersShow = filteredOrders;
    } else {
      this.ordersShow = JSON.parse(localStorage.getItem('sellerorders'));
    }
    this.selected = status;
    localStorage.removeItem('sellerorders_filtered');
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
    this.ordersSub.unsubscribe();
    // localStorage.removeItem('order');
  }

}
