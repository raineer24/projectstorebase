import { Store } from '@ngrx/store';
import { AppState } from '../../../../interfaces';
import { getCartItems } from '../../../../checkout/reducers/selectors';
import { CheckoutActions } from '../../../../checkout/actions/checkout.actions';
import { UserActions } from '../../../actions/user.actions';
import { UserService } from '../../../services/user.service';
import { getUserLists } from '../../../reducers/selector';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../../../../environments/environment';
import { Item } from '../../../../core/models/item'
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.scss']
})
export class ListDetailComponent implements OnInit {
  routeSubscription$: Subscription;
  listSubscription$: Subscription;
  listId: number;
  items: any;
  list: any = { id: null, name: '', description: '', userId: null };
  listName = new FormControl;
  listNote = new FormControl;
  cartItems: any;
  private componentDestroyed: Subject<any> = new Subject();

  constructor(
    private store: Store<AppState>,
    private userService: UserService,
    private userActions: UserActions,
    private checkoutActions: CheckoutActions,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.store.dispatch(this.userActions.getUserLists());
    this.route.params.takeUntil(this.componentDestroyed).subscribe(
      (params: any) => {
        this.listId = params['id'];
        this.userService.getListItems(this.listId).takeUntil(this.componentDestroyed)
          .subscribe(items => {this.items = items; console.log(items)});
        this.store.select(getUserLists).takeUntil(this.componentDestroyed)
          .subscribe(lists => {
          const list = lists.find(data => data.id == this.listId);
          if(list) {
            this.list = list;
            this.listName.setValue(list.name);
            this.listNote.setValue(list.description);
          }
        });
     });
    this.store.select(getCartItems).takeUntil(this.componentDestroyed).subscribe(cartItems => {
      this.cartItems = cartItems;
    })
  }

  getItemImageUrl(key: string): string {
    let url;
    if (key) {
      url = environment.IMAGE_REPO + key + '.jpg';
    } else {
      url = 'assets/omg-01.png';
    }
    return url;
  }

  addToCart(item: any) {
    delete item.item_id;
    delete item.list_id;
    delete item.listitem_id;
    this.store.dispatch(this.checkoutActions.addToCart(item));
  }

  addAllToCart(){
    console.log(this.items.length);
    for(let i = 0, l = this.items.length; i < l; i++) {
      console.log("TEST")
      if(!this.cartItems.find(cartItem => cartItem.item_id === this.items[i].id)) {
        this.addToCart(this.items[i]);
        console.log("ADD");
      }
    }
  }

  removeItem(index: number, id: number): void {
    this.userService.removeListItem(id).takeUntil(this.componentDestroyed).subscribe(res => {
      if(res.message == 'Deleted') {
        this.items.splice(index, 1);
      }
    })
  }

  updateList() {
    if(this.list.id && (this.list.name != this.listName.value || this.list.description != this.listNote.value)) {
      const list = {
        id: this.list.id,
        name: this.listName.value,
        description: this.listNote.value
      }
      this.store.dispatch(this.userActions.updateUserList(list));
      this.userService.updateList(list).takeUntil(this.componentDestroyed).subscribe(res => {
        if(res.message.indexOf('Updated') >= 0) {
          this.store.dispatch(this.userActions.updateUserListSuccess(list));
        }
      })
    }
  }

  deleteList() {
    if(this.list.id) {
      this.userService.deleteList(this.list.id).takeUntil(this.componentDestroyed).subscribe(res => {
        if(res.message == 'Deleted') {
          this.store.dispatch(this.userActions.deleteUserListSuccess(this.list.id));
          this.router.navigateByUrl('/user/lists');
        }
      });
    }
  }

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.unsubscribe();
  }
}
