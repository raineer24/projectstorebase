import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
  orders: Array<any> = [];
  ordersCount: Array<any> = [];
  ordersSub: Subscription;
  userData: any;
  selectedValue: string = 'ALL';
  toDate = new Date();
  fromDate = new Date();
  maxDate = new Date();
  showFilter: boolean = false;
  activeTab: number;
  unassignOrder: any;
  statusArrayData: Array<string> = ['PENDING','IN-PROGRESS','ASSEMBLED','IN-TRANSIT','COMPLETE','CANCELLED','RETURNED','RETURNED-COMPLETE'];
  timeslotsData: Array<string> = ['8AM','11AM','2PM','5PM','8PM'];
  statusArray: Array<string> = [];
  @ViewChild('unassignModal') unassignModal;

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
    this.ordersSub = this.adminService.getAssembleOrders(this.userData.seller_id, {
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
      this.adminService.getFreshFrozenCount(this.userData.seller_id).subscribe(result => {
        this.ordersCount = result;
      })
    });
  }

  takeOrder(orderSeller: any): void {
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
        this.orders[Number(orderSeller.timeslot_id) - 1].pending--;
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

  setUnassign(orderSeller: any): void {
    this.unassignOrder = orderSeller;
    this.unassignModal.show();
  }

  cancelUnassign(): void {
    this.unassignOrder = null;
    this.unassignModal.hide();
  }

  confirmUnassign(): void {
    this.unassignModal.hide();
    const order = this.unassignOrder;
    const data = {
      id: order.id,
      selleraccount_id: 0,
      updatedBy: this.userData.id,
      status: '',
      assembledBy: 0,
      deliveredBy: 0,
    }
    if (order.status.toUpperCase() == 'IN-PROGRESS') {
      this.orders[Number(order.timeslot_id) - 1].pending--;
      data.status = 'pending';
      delete data.deliveredBy;
    } else if (order.status.toUpperCase() == 'IN-TRANSIT') {
      data.status = 'assembled';
      delete data.assembledBy;
    }
    this.adminService.updateSellerOrder(data).mergeMap(response => {
      if(response.message.indexOf('Updated') >= 0) {
        return this.adminService.updateOrder({
          id: order.order_id,
          status: data.status,
        });
      } else {
        return Observable.empty();
      }
    }).subscribe(response => this.initOrders());
  }

  showButton(orderSeller: any, button: string): boolean {
    switch (button) {
      case 'TAKE':
        return orderSeller.status.toUpperCase() == 'PENDING';
      case 'CONTINUE':
        return (orderSeller.status.toUpperCase() == 'IN-PROGRESS' && orderSeller.assembledBy == this.userData.id);
      case 'DELIVER':
        return orderSeller.status.toUpperCase() == 'ASSEMBLED';
      case 'VIEW':
        return ((orderSeller.status.toUpperCase() != 'PENDING' && orderSeller.status.toUpperCase() != 'IN-PROGRESS' && orderSeller.status.toUpperCase() != 'ASSEMBLED') || (this.userData.role_id != 9 && this.userData.role_id != 10));
      case 'UNASSIGN':
        return (orderSeller.selleraccount_id && this.userData.role_id != 9 && this.userData.role_id != 10);
    }
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

  isPerishable(orderSeller: any): boolean {
    const index = this.ordersCount.findIndex((order) => orderSeller.order_id == order.order_id);
    if (index >= 0) {
      return this.ordersCount[index].itemCount ? true : false;
    } else {
      return false;
    }
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
