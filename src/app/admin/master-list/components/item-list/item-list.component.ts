import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AdminService } from '../../../services/admin.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-itemlist',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  private timer: Observable<any>;
  private subs: Subscription;
  itemList$: Subscription;
  items: any;
  categories: any;
  itemCount: number;

  constructor(
    private adminService: AdminService,
    private router: Router,
  ) { }

  ngOnInit() {
    //NOTE: dummy ID
    this.itemCount = 0;
    this.generateItemList(this.itemCount);

  }

  generateItemList(offset: number){
    this.itemList$ = this.adminService.getItems(offset).subscribe(list => {
      this.items = list['list'];
      this.categories = list['categories'];
    });
  }

  nextItems(){
    this.itemCount = this.itemCount + 10;
    this.generateItemList(this.itemCount);
  }

  prevItems(){
    if(this.itemCount !== 0){
      this.itemCount = this.itemCount - 10;
      this.generateItemList(this.itemCount);
    }
  }

  filterStatus(status){

  }

  initItems(options: any = { mode: 'itemlist', limit: this.itemsPerPage }): void {
    this.itemList$ = this.adminService.getItems(this.partnerId, options, this.filterUrl).subscribe(orders => {
      this.orders  = orders.map(order => {
        order.finalItemTotal = Number(order.finalItemTotal);
        return order;
      });
    });
  }

  initOrdersCount(): void {
    this.ordersCountSub = this.adminService.getOrdersellerList(this.partnerId, { mode: 'orderlist', count: 1 }, this.filterUrl).subscribe(result => {
      if (result.length) {
        this.totalItems = result[0].count;
      }
    });
  }

  applyFilter(): void {
    const filterText = [];
    this.filterUrl = {
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

    this.initOrders();
    this.initOrdersCount();
    this.currentPage = 1;
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
    this.initOrders({
      mode: 'orderlist',
      limit: this.itemsPerPage,
      skip: (this.currentPage - 1) * this.itemsPerPage,
    });
    this.initOrdersCount();
  }

  pageChanged(event: any): void {
    this.initOrders({
      mode: 'orderlist',
      limit: this.itemsPerPage,
      skip: (event.page - 1) * this.itemsPerPage,
    });
  }

  ngOnDestroy() {
    // localStorage.removeItem('order');
  }

}
