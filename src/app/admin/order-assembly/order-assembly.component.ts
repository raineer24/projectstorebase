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

  constructor(
    private adminService: AdminService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.ordersSub = this.adminService.getSellerOrders(this.sellerId).subscribe(order => {
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
        this.router.navigate(['/admin/order-assemble/edit', orderSeller.id]);
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
      }
    })
  }

  refresh(): void {
    this.ordersSub = this.adminService.getSellerOrders(this.sellerId).subscribe(order => {
      this.orders = order;
    });
  }

  applyFilter(): void {
    const filters = {
      status: this.selectedValue != 'ALL' ? this.selectedValue: '',
      minDate: new Date(this.fromDate.getFullYear(), this.fromDate.getMonth(), this.fromDate.getDate()).getTime(),
      maxDate: new Date(this.toDate.getFullYear(), this.toDate.getMonth(), this.toDate.getDate()).getTime(),
    }
    this.ordersSub = this.adminService.getSellerOrders(this.sellerId, filters).subscribe(order => {
      this.orders = order;
    });
    this.showFilter = false;
  }

  ngOnDestroy() {
    this.ordersSub.unsubscribe();
  }
}
