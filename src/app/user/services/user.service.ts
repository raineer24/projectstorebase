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
  getOrders(): Observable<Order[]> {
    return this.http.get('api/orders')
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
  getOrderDetail(orderNumber): Observable<Order> {
    return this.http.get(`spree/api/v1/orders/${orderNumber}`)
      .map((res: Response) => res.json())
      .catch(res => Observable.empty());
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
    const user_id = JSON.parse(localStorage.getItem('user')).id;
    return this.http.get(`v1/list/${user_id}/user`)
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
  createNewList(params): Observable<any> {
    const userId = 1;
    return this.http.post(`v1/${userId}/user`,{
      userId: userId,
      name: params.name
    })
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
  updateList(params: any): Observable<any> {
    const userId = 1;
    return this.http.put(`v1/list/${params.id}`,{
      name: params.name,
      description: params.description
    }).map((res: Response) => res.json()
    ).catch(res => Observable.empty());
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
    ).map((res: Response) => res.json()
    ).catch(res => Observable.empty());
  }


  /**
   *
   *
   * @returns {Observable<any>}
   *
   * @memberof UserService
   */
  getListItems(listId: number): Observable<any> {
    return this.http.get(`v1/listitems/${listId}/list`)
      .map((res: Response) => res.json())
      .catch(res => Observable.empty());
  }

  addListItem(params: any): Observable<any> {
    const userId = 1;
    return this.http.post(`v1/listitems`,{

      })
      .map((res: Response) => res.json())
      .catch(res => Observable.empty());
  }

  //removeListItem
  removeListItem(id: number): Observable<any> {
    const userId = 1;
    return this.http.delete(`v1/listitems/${id}`)
      .map((res: Response) => res.json())
      .catch(res => Observable.empty());
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
