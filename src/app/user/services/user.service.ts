import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http';
import { UserActions } from '../actions/user.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../interfaces';
import { Order } from '../../core/models/order';
import { Response } from '@angular/http';
import { User } from '../../core/models/user';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class UserService {
  switchBool: boolean = false;
  closeBtn: boolean = false;
  constructor(
    private http: HttpService,
    private actions: UserActions,
    private store: Store<AppState>
  ) { }

  /**
   *
   *
   * @returns {Observable<Order[]>}
   *
   * @memberof UserService
   */
  getOrders(): Observable<any> {
    const user_id = JSON.parse(localStorage.getItem('user')).id;
    return this.http.get(`v1/user/account/order/${user_id}`)
      .map((res: Response) => res.json())
      .catch(res => Observable.empty());
  }

  /**
   *
   *
   * @param {any} orderNumber
   * @returns {Observable<Order>}
   *
   * @memberof UserService
   */
  getOrderDetail(orderkey): Observable<any> {
    return this.http.get(`v1/orderItem?limit=5000&key=${orderkey}`)
      .map((res: Response) => res.json())
      .catch(res => Observable.empty());
  }

  /**
  *
  *@param {number}id
  *
  *
  */
  getTimeSlotOrder(id: number) {
    return this.http.get(`v1/timeslotorder/${id}`
    ).map((res) => {
      return res.json();
    })
  }

  /**
  *
  *@param {number}id
  *
  *retrieve specific timeslot
  */
  getTimeslot(id: number) {
    return this.http.get(`v1/timeslot/${id}`
    ).map((res) => {
      return res.json();
    })
  }

  /**
   *
   *
   * @returns {Observable<User>}
   *
   * @memberof UserService
   */
  getUser(): Observable<User> {
    const user_id = JSON.parse(localStorage.getItem('user')).id;
    return this.http.get(`spree/api/v1/users/${user_id}`)
      .map(res => res.json())
      .catch(res => Observable.empty());
  }

  /**
   *
   *
   * @returns {Observable<any>}
   *
   * @memberof UserService
   */
  getLists(): Observable<any> {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    return this.http.get(`v1/list/${userId}/user`)
      .map((res: Response) => res.json())
      .catch(res => Observable.empty());
  }

  /**
   *
   *
   * @returns {Observable<any>}
   *
   * @memberof UserService
   */
  createNewList(list): Observable<any> {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    return this.http.post(`v1/list/${userId}/user`,{
      useraccount_id: userId.toString(),
      name: list.name,
      description: list.description
    }).map((res: Response) => {
      const data = res.json();
      let storeList = {};
      if(data.message == 'Saved') {
        storeList = {
          id: data.id,
          name: list.name,
          description: list.description,
          userId: userId
        }
        this.http.loading.next({
          loading: false,
          success: true,
          message: `List ${list.name} successfully created.`
        });
      }
      return storeList;
    }).catch(res => Observable.empty());
  }

  /**
   *
   *
   * @returns {Observable<any>}
   *
   * @memberof UserService
   */
  updateList(list: any): Observable<any> {
    return this.http.put(`v1/list/${list.id}`,{
      name: list.name,
      description: list.description
    }).map((res: Response) => {
      const response = res.json();
      if(response.message.indexOf('Updated') >= 0) {
        this.store.dispatch(this.actions.updateUserListSuccess(list));
        this.http.loading.next({
          loading: false,
          success: true,
          message: `List updated.`
        });
      }
      return response;
    }).catch(res => Observable.empty());
  }

  /**
   *
   *
   * @returns {Observable<any>}
   *
   * @memberof UserService
   */
  deleteList(id: number): Observable<any> {
    return this.http.delete(`v1/list/${id}`
    ).map((res: Response) => {
      const response = res.json();
      if(response.message == 'Deleted') {
        this.store.dispatch(this.actions.deleteUserListSuccess(id));
        this.http.loading.next({
          loading: false,
          info: true,
          message: `List deleted.`
        });
      }
      return response;
    }).catch(res => Observable.empty());
  }


  /**
   *
   *
   * @returns {Observable<any>}
   *
   * @memberof UserService
   */
  getListItems(listId: number): Observable<any> {
    return this.http.get(`v1/listitems/${listId}/list?limit=5000`)
      .map((res: Response) => res.json())
      .catch(res => Observable.empty());
  }

  addListItem(params: any): Observable<any> {
    return this.http.post(`v1/listitems`, params)
      .map((res: Response) => {
        const response = res.json();
        if(response.message == 'Saved') {
          this.http.loading.next({
            loading: false,
            success: true,
            message: `Item added to list.`
          });
        }
        return response;
      }).catch(res => Observable.empty());
  }

  //removeListItem
  removeListItem(id: number, itemName: string = "Item"): Observable<any> {
    return this.http.delete(`v1/listitems/${id}`)
      .map((res: Response) => {
        const response = res.json();
        if(response.message == 'Deleted') {
          this.http.loading.next({
            loading: false,
            info: true,
            message: `${itemName} removed from list.`
          });
        }
        return response;
      }).catch(res => Observable.empty());
  }

  getListsOfItem(id: number): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user) {
      return this.http.get(`v1/listitems/${user.id}/item/${id}?limit=100`)
        .map((res: Response) => res.json())
        .catch(res => Observable.empty());
    } else {
      return Observable.empty();
    }
  }

  /**
   *
   *
   * @param {number} userId
   * @returns any
   *
   * @memberof CheckoutService
   */
  getAddress(userId: number): any {
    return this.http.get(`v1/address/${userId}/list`
    ).map((res) => {
      const response = res.json();
      return response;
    });
  }

  /**
   *
   *
   * @param {number} userId
   * @returns any
   *
   * @memberof CheckoutService
   */
  getAddressById(addressId: number): any {
    return this.http.get(`v1/address/${addressId}/view`
    ).map((res) => {
      const response = res.json();
      return response;
    });
  }

  /**
   *
   *
   * @param {any} data
   * @returns any
   *
   * @memberof CheckoutService
   */
  updateAddress(data: any): any {
    return this.http.put(`v1/address/${data.id}/save`, data
    ).map((res) => {
      const response = res.json();
      return response;
    });
  }

  /**
   *
   *
   * @param {any} data
   * @returns any
   *
   * @memberof CheckoutService
   */
  saveAddress(data: any): any {
    return this.http.post(`v1/address/save`, data
    ).map((res) => {
      const response = res.json();
      return response;
    });
  }

  /**
   *function to save star rating to db
   *
   * @returns {Observable<Order[]>}
   *
   * @memberof UserService
   */
  createStarRating(rating): Observable<any> {
    return this.http.post(`v1/ratings/save`,{
      useraccount_id: rating.useraccount_id,
      orderkey: rating.orderkey,
      starCount: rating.starCount,
      feedback: rating.feedback,
      feedbacktype: rating.feedbacktype
    }).map((res: Response) => res.json())
      .catch(res => Observable.empty());
  }

  getStarRating(orderkey: string): Observable<any> {
    return this.http.get(`v1/ratings/?orderkey=${orderkey}`
    ).map((res: Response) => res.json())
      .catch(res => Observable.empty());
  }
  /**
   *
   *
   * @returns void
   *
   * @memberof UserService
   */

  showThankyou(): void{
    this.http.loading.next({
      loading: false,
      thankYou: true,
      hasMsg: `Thank you!`,
      reset: 4500
    });
   }

  showMessage(mode: string, details: string = '') {
    switch(mode) {
      case 'item_exist':
        this.http.loading.next({
          loading: false,
          error: true,
          message: `${details} already in cart.`
        });
        break;
      case 'address_error':
        this.http.loading.next({
          loading: false,
          hasError: true,
          hasMsg: `Please enter required information.`,
          reset: 4500
        });
        break;
      case 'address_success':
        this.http.loading.next({
          loading: false,
          success: true,
          message: `Address successfully saved.`
        });
        break;
    }

  }

  /**
   *
   *
   * @returns boolean
   *
   * @memberof UserService
   */

   switch(): boolean{
     console.log('BEFORE: '+this.switchBool);
     if(this.switchBool){
      this.switchBool = false;
     } else {
      this.switchBool = true;
     }
     console.log('AFTER: '+this.switchBool);
     return this.switchBool;
   }


/*
GET list/{useraccount_id} = return all user's list
POST list {useraccount_id} = create new list
PUT list/{id} {payload} = edit list name
DELETE list/{id}= delete list
GET listitem/{listitem_id} = return all items in the list
PUT listitem/{listitem_id} {list_id, item_id, user_id} = add item to list
DELETE listitem/{listitem_id} = delete item from list
*/

}
