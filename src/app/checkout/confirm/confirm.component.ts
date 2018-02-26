import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserActions } from './../../user/actions/user.actions';
import { UserService } from './../../user/services/user.service';
import { CheckoutService } from './../../core/services/checkout.service';
import { getAuthStatus } from '../../auth/reducers/selectors';
import { AppState } from './../../interfaces';
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
  orderKey: string;
  orderDetails: any;
  cartItemArray: Array<number>;

  constructor(
    private userActions: UserActions,
    private userService: UserService,
    private checkoutService: CheckoutService,
    private store: Store<AppState>,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.isAuthenticated$ = this.store.select(getAuthStatus);
    //
    this.route.params.map((params: any) => {
      this.orderKey = params['key']
        return this.checkoutService.getOrder(this.orderKey).map(details => {
          this.orderDetails = details;
          console.log(details)
          this.cartItemArray = details['items'].map(item => item.item_id)
          return this.orderDetails;
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

}
