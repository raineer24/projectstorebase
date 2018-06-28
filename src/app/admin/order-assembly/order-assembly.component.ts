import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AdminService } from './../services/admin.service';

@Component({
  selector: 'app-order-assembly',
  templateUrl: './order-assembly.component.html',
  styleUrls: ['./order-assembly.component.scss']
})
export class OrderAssemblyComponent implements OnInit {
  orders: any;
  ordersSub: Subscription;
  orderSub: Subscription;
  orderItem$: Subscription;
  orderIndex$: any;
  orderItems: any;
  itemList: any;
  ordersShow: any;
  statusContainer: string[] = [];
  userData: any;
  selectedValue: string = 'ALL';
  toDate = new Date();
  fromDate = new Date();
  maxDate = new Date();
  showFilter: boolean = false;
  sellerId = 1; //TODO: dummy ID
  activeTab: number;
  statusArrayData: Array<string> = ['PENDING','IN-PROGRESS','ASSEMBLED','IN-TRANSIT','COMPLETE','CANCELLED','RETURNED','RETURNED-COMPLETE'];
  timeslotsData: Array<string> = ['8AM','11AM','2PM','5PM','8PM'];
  statusArray: Array<string> = [];

  constructor(
    private adminService: AdminService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('selleruser'));
    switch(this.userData.role_id) {
      case 9: // shoppers
        this.statusArray.push(this.statusArrayData[0]);
        this.statusArray.push(this.statusArrayData[1]);
        break;
      case 10: // drivers
        this.statusArray.push(this.statusArrayData[2]);
        this.statusArray.push(this.statusArrayData[3]);
        this.statusArray.push(this.statusArrayData[6]);
        break;
      default: // coordinator
        this.statusArray = this.statusArrayData;
    }
    this.initOrders();
  }

  initOrders(): void {
    const now = new Date().getHours();
    this.activeTab = now < 5 ? 0: Math.floor((now - 5)/3);
    this.activeTab = this.activeTab > 4 ? 4: this.activeTab;
    this.ordersSub = this.adminService.getAssembleOrders(this.sellerId, {
      orderStatus: this.selectedValue,
      mode: 'assembly',
    }).subscribe(orders => {
      this.orders = [];
      let timeslotOrders = [];
      this.timeslotsData.forEach((timeslot, index) => {
        switch(this.userData.role_id) {
          case 9: // shoppers
            timeslotOrders = orders.filter(order => order.timeslot_id == `${index + 1}` && (order.status.toUpperCase() == 'PENDING' || (order.status.toUpperCase() == 'IN-PROGRESS' && order.selleraccount_id == this.userData.id)));
            timeslotOrders.sort((a,b) => this.sortCompare(a,b));
            break;
          case 10: // drivers
            timeslotOrders = orders.filter(order => order.timeslot_id == `${index + 1}` && (order.status.toUpperCase() == 'ASSEMBLED' || ((order.status.toUpperCase() == 'IN-TRANSIT' || order.status.toUpperCase() == 'RETURNED') && order.selleraccount_id == this.userData.id)));
            timeslotOrders.sort((a,b) => this.sortCompare(a,b));
            break;
          default: // coordinator
            timeslotOrders = orders.filter(order => order.timeslot_id == `${index + 1}`);
        }
        this.orders.push({
          timeslot: timeslot,
          orders: timeslotOrders,
          pending: timeslotOrders.filter(order => order.status.toUpperCase() == 'PENDING').length,
        });
      });
    });
  }

  takeOrder(orderSeller: any): void {
    this.orders[Number(orderSeller.timeslot_id) - 1].pending--;
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
    }).subscribe((response: any) => {
      if(response && response.message.indexOf('Updated') >= 0) {
        this.router.navigate(['/admin/order-assemble/edit', orderSeller.id]);
      } else {
        this.initOrders();
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
    this.adminService.updateSellerOrder(data).mergeMap(response => {
      if(response.message.indexOf('Updated') >= 0) {
        return this.adminService.updateOrder({
          id: orderSeller.order_id,
          status: 'in-transit',
        });
      } else {
        return Observable.empty();
      }
    }).subscribe(response => {
      if(response && response.message.indexOf('Updated') >= 0) {
        this.router.navigate(['/admin/order-assemble/view', orderSeller.id]);
      } else {
        this.initOrders();
      }
    })
  }

  refresh(): void {
    this.initOrders();
  }

  applyFilter(): void {
    const filters = {
      status: this.selectedValue != 'ALL' ? this.selectedValue: '',
      minDate: new Date(this.fromDate.getFullYear(), this.fromDate.getMonth(), this.fromDate.getDate()).getTime(),
      maxDate: new Date(this.toDate.getFullYear(), this.toDate.getMonth(), this.toDate.getDate()).getTime(),
    }
    this.initOrders();
    this.showFilter = false;
  }

  ngOnDestroy() {
    this.ordersSub.unsubscribe();
  }

  private sortCompare(a, b) {
    if (a.selleraccount_id > b.selleraccount_id) {
      return -1;
    }
    if (a.selleraccount_id < b.selleraccount_id) {
      return 1;
    }
    return 0;
  }
}
