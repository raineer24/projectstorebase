import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../interfaces';
import { UserActions } from '../../actions/user.actions';
import { Observable } from 'rxjs/Observable';
// import { Order } from '../../../core/models/order';
import { getUserOrders } from '../../reducers/selector';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders$: Observable<any[]>;
  showFeedBackTemplate: boolean = false;
  // allOrders: Subscription;
  orderKeyContainer: any;
  withStarFeedBack: Array<any>;

  constructor(
    private store: Store<AppState>,
    private userActions: UserActions,
    private userService: UserService
  ) {
    this.orders$ = this.store.select(getUserOrders);
  }

  ngOnInit() {
    this.withStarFeedBack = [];
    this.orderKeyContainer = [];
    this.store.dispatch(this.userActions.getUserOrders());
    this.orders$.subscribe(res => {
      if(this.orderKeyContainer.length > 1){ this.orderKeyContainer = []; }
      for(const key in res){
        if(res[key].number > 0){
          this.orderKeyContainer.push({
            orderkey: res[key].orderkey,
            ordernum: res[key].number
          });
        }
      }
      if(this.orderKeyContainer.length > 1) {
        if(this.orderKeyContainer[0].number === 0) {
          this.orderKeyContainer.pop();
        }
      }
    });

    for( var i = 0; i < this.orderKeyContainer.length; i ++){
      this.hasStarFeedback(this.orderKeyContainer[i]);
    }
  }

  hasStarFeedback(order) {
    this.userService.getStarRating(order['orderkey']).subscribe(rating => {
      if(this.withStarFeedBack.length > 1){  this.withStarFeedBack = []; }
      if(rating.message == null){
        if(rating.feedbacktype == 1){
          this.withStarFeedBack.push(order['ordernum']);
          localStorage.setItem('orderwithFB',JSON.stringify(this.withStarFeedBack));
        }
      } else {
        rating => Observable.empty();
      }
    });
  }

}
