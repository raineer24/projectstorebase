import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Store } from '@ngrx/store';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../../core/services/http';
import { AppState } from '../../interfaces';
import { Transaction } from '../transactions/transactions.component';

@Injectable()
export class AdminService {

  constructor(
    private http: HttpService,
    private store: Store<AppState>
  ) { }

  /**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   * @memberof AuthService
   */
  login(data): Observable<any> {
    return this.http.post(
      'v1/selleraccount/login', data)
      .map((res: Response) => {
      const resData = res.json();
      if (resData.message == 'Found') {
        // Setting token after login
        localStorage.setItem('selleruser', JSON.stringify(resData));
      } else {
        this.http.loading.next({
          loading: false,
          hasError: true,
          hasMsg: 'Please enter valid Credentials'
        });
      }
      return resData;
    });
  }

  /**
   *
   * @param void
   * @returns void
   *
   * @memberof AuthService
   */
   logout(): void {
     localStorage.removeItem('selleruser');
   }

  /**
   *
   * @param void
   * @returns boolean
   *
   * @memberof AuthService
   */
   isAuthenticated(): boolean {
     const jwtHelper: JwtHelperService = new JwtHelperService();
     const userData = JSON.parse(localStorage.getItem('selleruser'));
     if (!userData) {
       return false;
     } else {
       return !jwtHelper.isTokenExpired(userData.token);
     }
   }

   /**
    *
    * @param void
    * @returns any
    *
    * @memberof AuthService
    */
    getUserRole(): any {
      const jwtHelper: JwtHelperService = new JwtHelperService();
      const userData = JSON.parse(localStorage.getItem('selleruser'));
      const tokenPayload = jwtHelper.decodeToken(userData.token);
      return tokenPayload.role;
    }
  /**
   *
   *
   * @returns {Observable<any[]>}
   *
   * @memberof AdminService
   */
  getSellerOrders(seller_id: number): Observable<any> {
    return this.http.get(`v1/ordersellers?sellerId=${seller_id}`)
      .map((res: Response) => res.json())
      .catch(res => Observable.empty());
  }

  /**
   *
   *
   * @returns {Observable<Transaction[]>}
   *
   * @memberof AdminService
   */
  getTransactions(): Observable<Transaction[]> {
    return this.http.get(`v1/transactions`)
      .map((res: Response) => res.json())

      .catch(res => Observable.empty());

  }


  /**
   *
   *
   * @returns {Observable<any>}
   *
   * @memberof AdminService
   */
  getSellerOrder(orderseller_id: number): Observable<any> {
    return this.http.get(`v1/ordersellers/${orderseller_id}`)
      .map((res: Response) => res.json())
      .catch(res => Observable.empty());
  }


  /**
   *
   *
   * @param {any} orderNumber
   * @returns
   *
   * @memberof AdminService
   */
  getOrder(orderKey) {
    return this.http.get(`v1/order?orderkey=${orderKey}`)
      .map(res => res.json())
      .flatMap((order: any) => {
        return this.http.get(`v1/orderItem?limit=5000&key=${orderKey}`)
          .map(res => {
            order.items = res.json()
            return order;
          })
      })
      .catch(err => Observable.empty());
  }

  /**
   *
   *
   * @param {any} orderNumber
   * @returns {Observable<Order>}
   *
   * @memberof AdminService
   */
  getOrderDetail(orderkey): Observable<any> {
    return this.http.get(`v1/orderItem?limit=5000&key=${orderkey}`)
      .map((res: Response) => res.json())
      .catch(res => Observable.empty());
  }


  /**
   *
   *
   * @returns {Observable<any>}
   *
   * @memberof AdminService
   */
  getOrderItems(order_id: number): Observable<any> {
    return this.http.get(`v1/orderItem?limit=1000&orderId=${order_id}`)
      .map((res: Response) => res.json())
      .catch(res => Observable.empty());
  }

  /**
   *
   *
   * @returns {Observable<any>}
   *
   * @memberof AdminService
   */
  updateOrderItem(orderItem: any): Observable<any> {
    return this.http.put(`v1/orderItem/${orderItem.orderItem_id}`, {
      "item_id": orderItem.id,
      "quantity": orderItem.finalQuantity,
      "status": orderItem.status
    }
    ).map((res) => {
      return res.json();
    }).catch(err => Observable.empty());
  }

  /**
   *
   *
   * @returns {Observable<any>}
   *
   * @memberof AdminService
   */
  finalizeOrder(order: any): Observable<any> {
    return this.http.put(`v1/order/${order.order_id}/seller`, {
      "finalTotalQuantity": order.finalQuantity,
      "finalItemTotal": order.finalTotal
    }
    ).map((res) => {
      return res.json();
    }).catch(err => Observable.empty());
  }

  /**
   *
   *
   * @returns {Observable<user[]>}
   *
   * @memberof AdminService
   */
  getPBUsers(pb_id: number): Observable<any> {
    return this.http.get(`v1/user/account/partnerbuyerusers/${pb_id}`)
      .map((res: Response) => res.json())
      .catch(res => Observable.empty());
  }
  /**
   *
   *
   * @returns {Observable<user[]>}
   *
   * @memberof AdminService
   */
  getUsers(): Observable<any> {
    return this.http.get(`v1/selleraccounts`)
      .map((res: Response) => res.json())
      .catch(res => Observable.empty());
  }

  /**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   * @memberof AdminService
   */
  updatePBU(id, data): Observable<any> {
    console.log(data);
    return this.http.put(
      `v1/user/account/partnerbuyeruser/${id}/save`, data
    ).map((res: Response) => {
      let result = res.json();
      if (result.message.indexOf('Updated') >= 0) {
        data.message = result.message;
        }
        //this.setTokenInLocalStorage(storedData);
        this.http.loading.next({
          message: `Profile was successfully saved.`
        });
      return result;
    });
  }

  /**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   * @memberof AdminService
   */
  createPBU(data): Observable<any> {
    console.log(data);
    return this.http.post(
      `v1/user/account/partnerbuyerusers`, data
    ).map((res: Response) => res.json())
    .catch(res => Observable.empty());
  }

  /**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   * @memberof AdminService
   */
  update(id, data): Observable<any> {
    return this.http.put(
      `v1/user/account/${id}/save`, data
    ).map((res: Response) => {
      let result = res.json();
      if (result.message.indexOf('Updated') >= 0) {
        let storedData = JSON.parse(localStorage.getItem('user'));
        data.message = result.message;
        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            storedData[key] = data[key];
          }
        }
        //this.setTokenInLocalStorage(storedData);
        this.http.loading.next({
          message: `Profile was successfully saved.`
        });
      } else {
        // this.http.loading.next({
        //   loading: false,
        //   hasError: true,
        //   hasMsg: 'Please enter valid Credentials'
        // });
      }
      return result;
    });
  }

  /**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   * @memberof AdminService
   */
  view(id): Observable<any> {
    return this.http.get(
      `v1/user/account/${id}/view`
    ).map((res: Response) => {
      let data = res.json();
      if (data.message == 'Found') {
        this.setTokenInLocalStorage(res.json());
      } else {
        data.error = true;
        // this.http.loading.next({
        //   loading: false,
        //   hasError: true,
        //   hasMsg: 'Please enter valid Credentials'
        // });
      }
      return data;
    });
    // catch should be handled here with the http observable
    // so that only the inner obs dies and not the effect Observable
    // otherwise no further login requests will be fired
    // MORE INFO https://youtu.be/3LKMwkuK0ZE?t=24m29s
  }

  /**
   *
   *
   * @private
   * @param {any} user_data
   *
   * @memberof AdminService
   */
  private setTokenInLocalStorage(user_data): void {
    const jsonData = JSON.stringify(user_data);
    localStorage.setItem('user', jsonData);
  }
}
