import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AdminService } from './../services/admin.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  providers: [DatePipe],
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
  sellerId: number = 1; //TODO: temporary

  showFilter: boolean = false;
  filterText: string = 'None';
  filterUrl: any = {};
  filterStatus: any = 0;
  filterOrderNumber: number = null;
  filterTimeslotId: number = 0;
  filterOrderDate: Array<Date> = [];
  filterDeliverDate: Array<Date> = [];
  statusArrayData: Array<string> = ['PENDING','IN-PROGRESS','ASSEMBLED','IN-TRANSIT','COMPLETE','CANCELLED','RETURNED','RETURNED-COMPLETE'];
  timeslotsData: Array<string> = ['8:00AM','11:00AM','2:00PM','5:00PM','8:00PM'];

  constructor(
    private adminService: AdminService,
    private datePipe: DatePipe,
  ) {
    this.filterUrl = {
      mode: 'orderlist',
      orderStatus: null,
      orderNumber: null,
      orderDate: null,
      deliverDate: null,
      timeslotId: null,
    }
  }

  ngOnInit() {
    this.ordersSub = this.adminService.getOrdersellerList(this.sellerId, { mode: 'orderlist' }).subscribe(orders => {
      this.orders  = orders.map(order => {
        order.finalItemTotal = Number(order.finalItemTotal);
        return order;
      });
      //
      // var i: number;
      // for(i=0; i < this.orders.length; i++){
      //   if(this.statusContainer.length == 0){
      //     this.statusContainer.push(this.orders[i].status);
      //   } else {
      //     if(!this.statusContainer.includes(this.orders[i].status)){
      //       this.statusContainer.push(this.orders[i].status);
      //     }
      //   }
      // }
      // const jsonData = JSON.stringify(this.orders);
      // localStorage.setItem('sellerorders',jsonData);
      // this.ordersShow = JSON.parse(localStorage.getItem('sellerorders'));
    })
  }

  // filterStatus(status){
  //   var i = 0;
  //   var filteredOrders = [];
  //   this.ordersShow = JSON.parse(localStorage.getItem('sellerorders'));
  //
  //   if(status != 'All') {
  //     for(i=0; i < this.ordersShow.length; i++){
  //       if(this.ordersShow[i].status === status){
  //         filteredOrders.push(this.ordersShow[i]);
  //       }
  //     }
  //     localStorage.setItem('sellerorders_filtered',JSON.stringify(filteredOrders))
  //     this.ordersShow = filteredOrders;
  //   } else {
  //     this.ordersShow = JSON.parse(localStorage.getItem('sellerorders'));
  //   }
  //   this.selected = status;
  //   localStorage.removeItem('sellerorders_filtered');
  // }
  //
  // getOrder(index)
  // {
  //   var order = JSON.parse(localStorage.getItem('sellerorders'));
  //   var orderCode = order[index].orderBarcode;
  //   this.orderSub = this.adminService.getOrder(orderCode).subscribe(order =>
  //   {
  //     this.orderItems = order;
  //     const jsonData = JSON.stringify(this.orderItems);
  //     this.getOrderItems(orderCode);
  //     localStorage.setItem('orderseller',jsonData)
  //   })
  //
  // }
  //
  // getOrderItems(orderCode){
  //   this.orderItem$ = this.adminService.getOrderDetail(orderCode).subscribe( items =>
  //     {
  //       this.itemList = items;
  //       localStorage.setItem('orderedList',JSON.stringify(this.itemList));
  //       this.itemList = localStorage.getItem('orderedList');
  //     }
  //   )
  //
  // }

  applyFilter(): void {
    const filterText = [];
    this.filterUrl = {
      mode: 'orderlist',
      orderStatus: null,
      orderNumber: null,
      orderDate: null,
      deliverDate: null,
      timeslotId: null,
    };
    if (this.filterStatus) {
      filterText.push(`Status = <i>${this.filterStatus}</i>`);
      this.filterUrl.orderStatus = this.filterStatus;
    }
    if (this.filterOrderNumber) {
      filterText.push(`Order Number = <i>${this.filterOrderNumber}</i>`);
      this.filterUrl.orderNumber = this.filterOrderNumber;
    }
    if (this.filterOrderDate.length) {
      const d1 = this.filterOrderDate[0];
      const d2 = this.filterOrderDate[1]
      const d1time = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()).getTime();
      const d2time = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate() + 1).getTime();
      filterText.push(`Order Date = <i>From: ${this.datePipe.transform(d1,'MM/dd/yyyy')} To: ${this.datePipe.transform(d2,'MM/dd/yyyy')}</i>`);
      this.filterUrl.orderDate = `${d1time}|${d2time}`;
    }
    if (this.filterDeliverDate.length) {
      let deliveryText = '';
      const d1 = this.filterDeliverDate[0];
      const d2 = this.filterDeliverDate[1]
      const d1time = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()).getTime();
      const d2time = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate() + 1).getTime();
      deliveryText = `Delivery Date = <i>From: ${this.datePipe.transform(d1,'MM/dd/yyyy')} To: ${this.datePipe.transform(d2,'MM/dd/yyyy')}</i>`;
      this.filterUrl.deliverDate = `${d1time}|${d2time}`;
      if (this.filterTimeslotId) {
        this.filterUrl.timeslotId = this.filterTimeslotId;
        deliveryText += ` <i>Slot: ${this.timeslotsData[this.filterTimeslotId - 1]}</i>`
      }
      filterText.push(deliveryText);
    }
    this.filterText = filterText.length ? filterText.join(', '): 'None';

    this.ordersSub = this.adminService.getOrdersellerList(this.sellerId, this.filterUrl).subscribe(orders => {
      this.orders  = orders.map(order => {
        order.finalItemTotal = Number(order.finalItemTotal);
        return order;
      });
    });
  }

  resetFilter(): void {
    this.filterStatus = 0;
    this.filterOrderNumber = null;
    this.filterOrderDate = [];
    this.filterDeliverDate = [];
    this.filterTimeslotId = 0;
  }

  closeFilter(): void {
    this.showFilter = false;
  }

  refreshList(): void {
    this.ordersSub = this.adminService.getOrdersellerList(this.sellerId, this.filterUrl).subscribe(orders => {
      this.orders  = orders.map(order => {
        order.finalItemTotal = Number(order.finalItemTotal);
        return order;
      });
    });
  }

  ngOnDestroy() {
    this.ordersSub.unsubscribe();
    // localStorage.removeItem('order');
  }

}
