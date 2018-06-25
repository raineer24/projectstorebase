import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserActions } from './../../user/actions/user.actions';
import { UserService } from './../../user/services/user.service';
import { CheckoutService } from './../../core/services/checkout.service';
import { getAuthStatus } from '../../auth/reducers/selectors';
import { getSortSettings } from './../../home/reducers/selectors';
import { ProductService } from '../../core/services/product.service';
import { ProductActions } from '../../product/actions/product-actions';
import { AppState } from './../../interfaces';
import { SearchActions } from './../../home/reducers/search.actions';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  saveListState: number = 0;
  inputNewList: string;
  isAuthenticated$: Observable<boolean>;
  timeSlotOrder$: Subscription;
  timeSlot$: Subscription;
  orderKey: string;
  orderDetails: any;
  timeSlot: any;
  deliveryDate: any;
  cartItemArray: Array<number>;
  merridian: string;
  fees: Object;
  sortSettings: any;

  constructor(
    private userActions: UserActions,
    private productService: ProductService,
    private productActions: ProductActions,
    private userService: UserService,
    private checkoutService: CheckoutService,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private searchActions: SearchActions

  ) { }

  ngOnInit() {
    //NOTE: TEMPORARY!!! FEES TO BE DECIDED
    let settings = localStorage.getItem('settings');
    settings = JSON.parse(settings);
    console.log(settings);
    this.fees = {
      service: 100,
      delivery: 100,
    };
    let paidAmount = 0;
    this.isAuthenticated$ = this.store.select(getAuthStatus);
    this.route.params.map((params: any) => {
      this.orderKey = params['key']
        return this.checkoutService.getOrder(this.orderKey).map(details => {
          details.subTotal = Number(details.itemTotal);
          // details.amountTotal = Number(details.total) - Number(details.paymentTotal) - Number(details.discountTotal);
          details.amountTotal = Number(details.adjustmentTotal);
          paidAmount = Number(localStorage.getItem('confirmationPayment'));
          details.paymentTotal = paidAmount;
          details.discount = Number(localStorage.getItem('discount'));
          this.orderDetails = details;
          this.showTimeSlotOrder(details.id);
          this.cartItemArray = details['items'].map(item => item.item_id)
          return details;
        }).subscribe();
    }).subscribe();
    // localStorage.removeItem('confirmationPayment');
    localStorage.removeItem('payment');
    // localStorage.removeItem('discount');
    // localStorage.removeItem('voucher');
  }

  showTimeSlotOrder(orderId){
    let tsID = 0;
    let timerange = 0;
    this.timeSlot = 0;
    this.timeSlotOrder$ = this.userService.getTimeSlotOrder(orderId).map( timeslot => {
        this.deliveryDate = timeslot.datetime;
        tsID = timeslot.timeslot_id;
        this.timeSlot$ = this.userService.getTimeslot(tsID).map( time => {
          timerange = time.range;
          //Sets time as AM/PM
          if(tsID > 2){
            this.merridian = 'PM';
          } else {  this.merridian = 'AM'; }
          //Convert military time to standard time - 13:00 becomes 1:00
          if(tsID == 2){
            this.timeSlot = '11:00';
          } else if(tsID == 3){
            this.timeSlot = '2:00';
          } else if(tsID == 4){
            this.timeSlot = '5:00';
          } else if (tsID == 5 || tsID == 1){
            this.timeSlot = '8:00';
          }
          return this.timeSlot;
        }).subscribe();
    }).subscribe();
  }

  createNewList() {
    if(this.inputNewList) {
      const d = new Date();
      const list = {
        name: this.inputNewList,
        description: d.toLocaleDateString() +' '+ d.toLocaleTimeString()
      }
      this.store.dispatch(this.userActions.saveCartItems(list,this.cartItemArray));
      this.saveListState = 2;
    }
  }

  selectCategory(...categories): void {
    // if(typeof(index) != 'undefined') {
    //   this.menuDelay.clicked[index] = true;
    // }
    let filters;
    if(categories[0] == 'all') {
      this.store.dispatch(this.productActions.getAllProducts(this.sortSettings));
    } else {
      filters = {
        mode: 'category',
        level: categories[0].level,
        categoryId: categories[0].id,
        breadcrumbs: categories.map(cat => { return {id: cat.id, name: cat.name, level: cat.level}}).reverse()
      }
      this.store.dispatch(this.productActions.getItemsByCategory(filters, this.sortSettings));
    }
    this.store.dispatch(this.searchActions.setFilter({
      filters: filters ? [filters]: [],
      categoryIds: []
    }));
    this.router.navigateByUrl('/');
    window.scrollTo(0, 0);
  }

}
