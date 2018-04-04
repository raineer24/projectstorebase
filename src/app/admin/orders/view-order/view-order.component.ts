import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent implements OnInit {
  orderSub: Subscription;
  orders:any;
  order:any;
  // @Input() orderedItems: any;
  orderData: {
    'id': Number,
    'email': string,
    'lastName': string,
    'firstName': string,
    'shippingAddress01': string,
    'city':string,
    'country': string,
    'postalcode':string
    'orderTotal': string
  };
  itemList:any;

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit() {
    if(localStorage.getItem('order') != ''){
      this.orderData = JSON.parse(localStorage.getItem('order'));
      this.itemList = JSON.parse(localStorage.getItem('orderedList'));
    }
  }

  onCancelClick(){
    window.history.back();
  }

  ngOnDestroy() {
    // this.ordersSub.unsubscribe();
  }

}
