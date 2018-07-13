import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Store } from '@ngrx/store';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../../core/services/http';
import { AppState } from '../../interfaces';
import { Transaction } from '../transactions/transactions.component';
import { environment } from './../../../environments/environment';

@Injectable()
export class AdminService {

  hasError: boolean;

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
      const response = res.json();
      if (response.message.toUpperCase() == 'FOUND') {
        // Setting token after login
        localStorage.setItem('selleruser', JSON.stringify(response));
      } else {
        console.log(response)
        const msg = response.message.toUpperCase();
        let errMsg = '';
        if(msg == 'NOT FOUND') {
          errMsg = 'Please enter valid credentials';
        } else if (msg == 'DISABLED') {
          errMsg = 'Account disabled. Please contact our administrator';
        } else if (msg == 'Failed') {
          errMsg = 'Server error. Pleaes try again later.'
        }
        this.http.loading.next({
          loading: false,
          hasError: true,
          hasMsg: errMsg,
        });
      }
      return response;
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
    *
    * @param {id} number
    * @returns {Observable<any>}
    *
    * @memberof AdminService
    */
   getUser(id: number): Observable<any> {
     return this.http.get(`v1/selleraccount/${id}/view`)
       .map((res: Response) => {
         const response = res.json();
         return response;
       });
   }

   /**
    *
    * @param {any} data
    * @returns {Observable<any>}
    *
    * @memberof AuthService
    */
    addUser(data: any): Observable<any> {
      return this.http.post(`v1/selleraccount/save`, data)
        .map((res: Response) => {
          const response = res.json();
          if(response.message === 'Saved') {
            this.http.loading.next({
              loading: false,
              isSuccess: true,
              hasMsg: response.message,
              reset: 4500
            });
          } else {
            this.http.loading.next({
              loading: false,
              hasError: true,
              hasMsg: response.message,
              reset: 4500
            });
          }
          return response;
        });
    }

  /**
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   * @memberof AuthService
   */
   updateUser(data: any): Observable<any> {
     return this.http.put(`v1/selleraccount/${data.id}/save`, data)
       .map((res: Response) => {
         const response = res.json();
         if(response.message.indexOf('Updated') >= 0) {
           this.http.loading.next({
             loading: false,
             isSuccess: true,
             hasMsg: response.message,
             reset: 4500
           });
         } else {
           this.http.loading.next({
             loading: false,
             hasError: true,
             hasMsg: response.message,
             reset: 4500
           });
         }
         return response;
       });
   }

   /**
    *
    * @param {void}
    * @returns {Observable<any>}
    *
    * @memberof AuthService
    */
    getRolesList(): Observable<any> {
      return this.http.get('v1/selleraccount/roles')
        .map((res: Response) => res.json());
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
  getAssembleOrders(partner_id: number, filters?: any): Observable<any> {
    let filterText = [];
    // if(filters.minDate && filters.maxDate) {
    //   filterText.push(`minDate=${filters.minDate}&maxDate=${filters.maxDate}`);
    // }
    if(filters.orderStatus) {
      filterText.push(`orderStatus=${filters.orderStatus}`);
    }
    if(filters.mode) {
      filterText.push(`mode=${filters.mode}`);
    }
    return this.http.get(`v1/ordersellers?partnerId=${partner_id}&${filterText.join('&')}`)
      .map((res: Response) => res.json())
      .catch(res => Observable.empty());
  }

  /**
   *
   *
   * @returns {Observable<any[]>}
   *
   * @memberof AdminService
   */
  getOrdersellerList(partner_id: number, options?: any, filters?: any): Observable<any> {
    let filterText = [];
    let keys = Object.keys(filters);
    keys.forEach(key => {
      if (filters[key]) {
        filterText.push(`${key}=${filters[key]}`)
      }
    });
    keys = Object.keys(options);
    keys.forEach(key => {
      if (options[key]) {
        filterText.push(`${key}=${options[key]}`)
      }
    });
    return this.http.get(`v1/ordersellers?partnerId=${partner_id}&${filterText.join('&')}`)
      .map((res: Response) => res.json())
      .catch(res => Observable.empty());
  }

  /**
   *
   *
   * @returns {Observable<any[]>}
   *
   * @memberof AdminService
   */
  getFreshFrozenCount(partnerId): Observable<any[]> {
    return this.http.get(`v1/ordersellers/count/freshFrozen?partnerId=${partnerId}`)
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
   * @returns {Observable<Logs[]>}
   *
   * @memberof AdminService
   */
  getLogs(): Observable<Transaction[]> {
    return this.http.get(`v1/logs`)
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
   * @param {data} any
   * @returns {Observable<any>}
   *
   * @memberof AdminService
   */
  updateSellerOrder(data: any): Observable<any> {
    return this.http.put(`v1/ordersellers/${data.id}`, data)
      .map((res: Response) => res.json())
      .catch(res => Observable.empty());
  }

  /**
   *
   *
   * @param {data} any
   * @returns {Observable<any>}
   *
   * @memberof AdminService
   */
  takeOrder(data: any): Observable<any> {
    return this.http.put(`v1/ordersellers/takeOrder/${data.id}`, data)
      .map((res: Response) => {
        const response = res.json();
        if(response.message.indexOf('Updated') == -1) {
          let errMsg = '';
          switch (response.message) {
            case 'User Assigned':
              errMsg = 'You are already handling an order';
              break;
            case 'Already Taken':
              errMsg = 'Order already handled by another user';
              break;
            case 'Failed':
              errMsg = 'Server error. Please try again later.';
              break;
          }
          this.http.loading.next({
            loading: false,
            hasError: true,
            hasMsg: errMsg,
            reset: 4500
          });
        };
        return response;
      }).catch(res => Observable.empty());
  }

  /**
   *
   *
   * @param {data} any
   * @returns {Observable<any>}
   *
   * @memberof AdminService
   */
  forwardToDelivery(data: any): Observable<any> {
    return this.http.put(`v1/ordersellers/forwardToDelivery/${data.orderseller.id}`, data)
      .map((res: Response) => {
        const response = res.json();
        return response;
      }).catch(res => Observable.empty());
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
    return this.http.get(`v1/orderItem?limit=1000&orderId=${order_id}&addCategory=true`)
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
  updateOrderItem(data: any): Observable<any> {
    return this.http.put(`v1/orderItem/${data.id}`, data
    ).map((res) => {
      return res.json();
    }).catch((err) => {
      return Observable.of(err);
    });
  }

  /**
   *
   *
   * @returns {Observable<any>}
   *
   * @memberof AdminService
   */
  updateOrder(data: any): Observable<any> {
    return this.http.put(`v1/order/${data.id}/seller`, data
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
  getPBUsers(pb_id: number, skip: number): Observable<any> {
    return this.http.get(`v1/user/account/partnerbuyerusers/${pb_id}?skip=${skip}`)
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
  getUsers(options ?: any): Observable<any> {
    let optionText = [];
    const keys = Object.keys(options);
    keys.forEach(key => {
      if (options[key]) {
        optionText.push(`${key}=${options[key]}`)
      }
    });
    return this.http.get(`v1/selleraccounts?${optionText.join('&')}`)
      .map((res: Response) => res.json())
      .catch(res => Observable.empty());
  }

  /**
   *
   * @param {string} email
   * @returns {Observable<user[]>}
   *
   * @memberof AdminService
   */
  resetPassword(email): Observable<any> {
    return this.http.post(`v1/selleraccount/${email}/resetpassword`, {
      email: email
    }).map((res: Response) => {
      let data = res.json();
      if (data.message === 'Success') {
        this.http.loading.next({
          loading: false,
          isSuccess: true,
          hasMsg: 'Password reset email has been successfully sent.',
          reset: 4500,
        });
      } else {
        this.http.loading.next({
          loading: false,
          hasError: true,
          hasMsg: 'Error occurred. Please try again later.',
          reset: 4500,
        });
      }
      return data;
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
  changePassword(data): Observable<any> {
    return this.http.put(`v1/selleraccount/${ data.id }/changepassword`, data)
      .map((res: Response) => {
        let result = res.json();
        if (result.message.indexOf('Updated') >= 0) {
          this.http.loading.next({
            loading: false,
            isSuccess: true,
            hasMsg: `Password was successfully updated.`,
            reset: 4500,
          });
        } else {
          this.http.loading.next({
            loading: false,
            hasError: true,
            hasMsg: 'Error occurred. Please try again later.',
            reset: 4500,
          });
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
   * @memberof AuthService
   */
  checkToken(data): Observable<any> {
    return this.http.post(
      'v1/selleraccount/token', data
    ).map((res: Response) => {
      return res.json();
    });
  }

  /**
   *
   *
   * @returns {Observable<user[]>}
   *
   * @memberof AdminService
   */
  checkUser(username): Observable<any> {
    return this.http.get(`v1/user/account/${username}/check`)
      .map((res: Response) => {
        return res.json();
      })
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
  addCategories(data): Observable<any> {
    return this.http.post(
      `v1/category/addmany`, data)
    .map((res: Response) => {
      return res.json();
    })
    .catch(res => Observable.empty());
  }

  /**
   *
   *
   * @returns {*}
   *
   * @memberof ProductService
   */
  getCategories(): any {
    return this.http.get(`v1/category/list`)
    .map(res => res.json())
    .catch(err => Observable.empty());
  }

  /**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   * @memberof AdminService
   */
  addItems(data): Observable<any> {
    return this.http.post(
      `v1/items/create`, data)
    .map((res: Response) => {
      return res.json();
    })
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
  updateItems(data): Observable<any> {
    return this.http.put(
      `v1/items/update`, data)
    .map((res: Response) => {
      return res.json();
    })
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
    return this.http.post(
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
  createUsers(data): Observable<any> {
   this.hasError = false;
   return this.http.post(
     `v1/user/account/savemany`, data
   ).map((res: Response) => {
     console.log(res.json());
     return res.json();
  })
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
  createPBU(data): Observable<any> {
    this.hasError = false;
    return this.http.put(
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
  createItems(data): Observable<any> {
    this.hasError = false;
    return this.http.put(
      `v1/items/create`, data
    ).map((res: Response) => res.json())
    .catch(res => Observable.empty());
  }

  /**
   *
   *
   * @param {any} id
   * @returns {Observable<any>}
   *
   * @memberof AdminService
   */
  getPartnerBuyerUser(id): Observable<any>{
    return this.http.get(`v1/user/account/partnerbuyeruser/${id}`)
    .map((res: Response) => {
      return res.json();
    })
    .catch(err => Observable.empty());
  }

  getItems(offset: number): Observable<any> {
    this.hasError = false;
    const limit = 10;
    return this.http.get(`v1/item?skip=${offset}`, )
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
  updatePartnerBuyerUser(data): Observable<any>{
    return this.http.post(`v1/user/account/partnerbuyeruser/${data.useraccount_id}/save`,data)
    .map(res => {
      return res.json();
    })
    .catch(err => Observable.empty());
  }

  /**
   *
   *
   * @param {number} order_id
   * @returns {Observable<any>}
   *
   * @memberof AdminService
   */
  getTransactionsPerOrder(order_id: number): Observable<any>{
    return this.http.get(`v1/transactions/orders/${order_id}`)
    .map(res => {
      return res.json();
    })
    .catch(err => Observable.empty());
  }

  /**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   * @memberof AdminService
   */
  updateTransaction(data: any): Observable<any>{
    return this.http.put(`v1/transactions/${data.id}`, data)
    .map(res => {
      return res.json();
    })
    .catch(err => Observable.empty());
  }

  // /**
  //  *
  //  *
  //  * @param {any} data
  //  * @returns {Observable<any>}
  //  *
  //  * @memberof AdminService
  //  */
  // update(id, data): Observable<any> {
  //   return this.http.put(
  //     `v1/user/account/${id}/save`, data
  //   ).map((res: Response) => {
  //     let result = res.json();
  //     if (result.message.indexOf('Updated') >= 0) {
  //       let storedData = JSON.parse(localStorage.getItem('user'));
  //       data.message = result.message;
  //       for (let key in data) {
  //         if (data.hasOwnProperty(key)) {
  //           storedData[key] = data[key];
  //         }
  //       }
  //       //this.setTokenInLocalStorage(storedData);
  //       this.http.loading.next({
  //         message: `Profile was successfully saved.`
  //       });
  //     } else {
  //       // this.http.loading.next({
  //       //   loading: false,
  //       //   hasError: true,
  //       //   hasMsg: 'Please enter valid Credentials'
  //       // });
  //     }
  //     return result;
  //   });
  // }

  /**
   *
   *
   * @returns {Observable<any>}
   *
   * @memberof AdminService
   */
  getTimeSlot(): Observable<any> {
    return this.http.get(
      `v1/timeslotorder`
    ).map((res: Response) => {
      return res.json();
    });
  }

  /**
   *
   * @param {Array<any>} data
   * @returns {Observable<any>}
   *
   * @memberof AdminService
   */
  updateAllTimeSlots(data: Array<any>): Observable<any> {
    return this.http.put(
      `v1/timeslots/all`, data
    ).map((res: Response) => {
      const response = res.json();
      if(response.message.indexOf('Updated') >= 0) {
        this.http.loading.next({
          loading: false,
          isSuccess: true,
          hasMsg: response.message,
          reset: 4500
        });
      } else {
        this.http.loading.next({
          loading: false,
          hasError: true,
          hasMsg: response.message,
          reset: 4500
        });
      }

      return response;
    });
  }

  /**
   *
   * @param {string} message
   * @returns {void}
   *
   * @memberof AdminService
   */
  showErrorMsg(message: string): void {
    this.http.loading.next({
      loading: false,
      hasError: true,
      hasMsg: message,
      reset: 4500
    });
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
