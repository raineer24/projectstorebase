import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserActions } from './../../user/actions/user.actions';
import { UserService } from './../../user/services/user.service';
import { getAuthStatus } from '../../auth/reducers/selectors';
import { AppState } from './../../interfaces';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  saveListState: number = 0;
  inputNewList: string;
  isAuthenticated$: Observable<boolean>;

  constructor(
    private userActions: UserActions,
    private userService: UserService,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.isAuthenticated$ = this.store.select(getAuthStatus);
  }

  createNewList() {
    if(this.inputNewList) {
      const d = new Date();
      const list = {
        name: this.inputNewList,
        description: d.toLocaleDateString() +' '+ d.toLocaleTimeString()
      }
      //TODO: Add cart as list
      // this.store.dispatch(this.userActions.saveCartItems(list,[21,32,43,43]));
      this.saveListState = 2;
    }
  }

}
