import { getOrderNumber } from './../../checkout/reducers/selectors';
import { CheckoutActions } from './../../checkout/actions/checkout.actions';
import { Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Item } from './../models/item';
import { CartItem } from './../models/cart_item';
import { Order } from './../models/order';
import { AppState } from './../../interfaces';
import { Store } from '@ngrx/store';
import { HttpService } from './http';

@Injectable()
export class CheckoutService {
  private orderNumber: number;
  private orderIdContainer: number;

  /**
   * Creates an instance of CheckoutService.
   * @param {HttpService} http
   * @param {CheckoutActions} actions
   * @param {Store<AppState>} store
   *
   * @memberof CheckoutService
   */
  constructor(
    private http: HttpService,
    private actions: CheckoutActions,
    private store: Store<AppState>,
  ) {
      // this.store.select(getOrderNumber)
        // .subscribe(number => this.orderNumber = number);
    }

//  Change below methods once angular releases RC4, so that this methods can be called from effects
//  Follow this linke to know more about this issue https://github.com/angular/angular/issues/12869

  /**
   *
   *
   * @param {number} variant_id
   * @returns
   *
   * @memberof CheckoutService
   */
  createNewCartItem(item: Item) {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id: 0;
    return this.http.post(`v1/orderItem`,
        {
          "user_id": userId,
          "item_id": item.id,
          "quantity": 1,
          "orderkey": this.getOrderKey(),
          "order_id": this.getOrderId()
        }
      ).map(res => {
          const data = res.json();
          let returnData;
          if(data.message == 'Saved') {
            returnData = {
             "id": data.id,
             "quantity": 1,
             "price": Number(item.price),
             "total": Number(item.price),
             "item_id": item.id,
             "item": item
           }
            this.http.loading.next({
              loading: false,
              success: true,
              message: `${item.name} added to cart.`
            });
          } else {
            returnData = new CartItem;
            this.http.loading.next({
              loading: false,
              error: true,
              message: `${item.name} already in cart.`
            });
          }
         return returnData;
      }).catch(err => Observable.empty());
  }

 /**
  *
  *
  * @returns
  *
  * @memberof CheckoutService
  */
  fetchCurrentOrder(isAuth: boolean) {
    const user = JSON.parse(localStorage.getItem('user'));
    const orderStorage = this.getOrderInLocalStorage();
    const orderkey = orderStorage != null ? orderStorage.order_token: null;
    if(orderkey) { console.log("CURRENT ORDER KEY")
      return this.http.get(`v1/order?orderkey=${orderkey}`).mergeMap(res => {
        let order:any = {};
        order = res.json();
        if(order.id) { console.log("FETCH CURRENT ORDER")
          return this.http.get(`v1/orderItem?limit=5000&key=${orderkey}`).map(res2 => {
            let cart_items = [], total = 0, total_quantity = 0, discount = 0, amtDue = 0, amtPaid = 0;
            const data = res2.json();
            for (let datum of data) {
              cart_items.push(this.formatCartItem(datum));
              total += Number(datum.price) * datum.quantity;
              total_quantity += Number(datum.quantity);
              discount = Number(datum.discount);
              amtDue = Number(datum.totalAmtDue);
              amtPaid = Number(datum.totalAmtPaid);
            }
            order.cartItems =  cart_items;
            order.totalQuantity = total_quantity.toString();
            order.itemTotal = total.toString();
            order.discount = discount.toString();
            order.adjustmentTotal= amtDue.toString();
            order.paymentTotal = amtPaid.toString();
            if (isAuth && user.id != order.useraccount_id) {
              order.firstname = '';
              order.lastname = '';
              order.email = '';
              order.phone = '';
              order.shippingAddress01 = '';
              order.shippingAddress02 = '';
              order.city = '';
              order.country = '';
              order.postalcode = '';
              order.specialInstructions = '';
              order.billingAddress01 = '';
              order.billingAddress02 = '';
              order.billCity = '';
              order.billCountry = '';
              order.billPostalcode = '';
              order.useraccount_id = user.id;
            }
            order.deliveryDate = {
              date: '',
              timeslotId: null,
            }
            return this.store.dispatch(this.actions.fetchCurrentOrderSuccess(order));
            // return this.http.get(`v1/timeslotorder/${order.id}`).map(res3 => {
            //   const date = res3.json();
            //   order.deliveryDate = {
            //     date: date.date,
            //     timeslotId: date.timeslot_id
            //   }
            //   return this.store.dispatch(this.actions.fetchCurrentOrderSuccess(order));
            // })
            // order.shippingAddress01 = orderStorage.shipping_address;
            // order.billingAddress01 = orderStorage.billing_address;
            // order.deliveryDate = {
            //   date: '',
            //   timeslotId: null,
            // }
            // return this.store.dispatch(this.actions.fetchCurrentOrderSuccess(order));
            // // return this.http.get(`v1/timeslotorder/${order.id}`
            // // ).map(res3 => {
            // //   const date = res3.json();
            // //   order.deliveryDate = {
            // //     date: date.date,
            // //     timeslotId: date.timeslot_id
            // //   }
            // //   return this.store.dispatch(this.actions.fetchCurrentOrderSuccess(order));
            // // })
          })
        } else { console.log("CREATE NEW ORDER")
          return this.createNewOrder();
        }
      })
    } else { console.log("NEW ORDER KEY")
      return this.createNewOrder();
    }
  }

  /**
   *
   *
   * @returns
   *
   * @memberof CheckoutService
   */
  createNewOrder() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id: 0;
    return this.http.get(`v1/orderkey`
    ).map(res => res.json()
    ).mergeMap(data => {
      const orderkey = data.orderkey;

      return this.http.post('v1/order', {
          orderkey: orderkey,
          status: 'cart',
          useraccount_id: userId,
          partner_id: 1, // TODO: refer to actual seller ID
        }).map(newOrder => {
          const orderId = newOrder.json()['id'];
          this.setOrderTokenInLocalStorage({
            order_id: orderId,
            order_token: orderkey,
          });

          let order: any = {};
          order.id = orderId;
          order.number = "0";
          order.orderkey = orderkey;
          order.cartItems =  [];
          order.totalQuantity = "0";
          order.itemTotal = "0";
          order.shippingAddress01 = '';
          order.billingAddress01 = '';
          order.deliveryDate = '';
          order.status = 'cart';
          return this.store.dispatch(this.actions.fetchCurrentOrderSuccess(order));
        })
    });
  }

  /**
   *
   *
   * @param {any} orderNumber
   * @returns
   *
   * @memberof CheckoutService
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
   * @returns
   *
   * @memberof CheckoutService
   */
  createEmptyOrder() {
    const user = JSON.parse(localStorage.getItem('user'));
    const headers = new Headers({
      'Content-Type': 'text/plain',
      'X-Spree-Token': user && user.spree_api_key
    });

    return this.http.post(
      'spree/api/v1/orders.json', {}, { headers: headers }
    ).map(res => {
      const order = res.json();
      const token = order.token;
      this.setOrderTokenInLocalStorage({order_token: token});
      return this.store.dispatch(this.actions.fetchCurrentOrderSuccess(order));
    }).catch(err => Observable.empty());
  }

  /**
   *
   *
   * @param {CartItem} cartItem
   * @returns
   *
   * @memberof CheckoutService
   */
  deleteCartItem(cartItem: CartItem) {
    return this.http.delete(`v1/orderItem/${cartItem.id}`)
      .map(res => {
        this.http.loading.next({
          loading: false,
          info: true,
          message: `${cartItem.item.name} removed from cart.`
        });
        this.store.dispatch(this.actions.removeCartItemSuccess(cartItem));
      }).catch(err => Observable.empty());
  }

  /**
   *
   *
   * @param {CartItem} cartItem
   * @returns
   *
   * @memberof CheckoutService
   */
  deleteCartItems() {
    const orderId = this.getOrderId();
    console.log(orderId)
    if (!orderId) {
      return Observable.of(false);
    }

    return this.http.delete(`v1/orderItem/all/${orderId}`)
      .map(res => {
        this.http.loading.next({
          loading: false,
          info: true,
          message: `All items removed from cart.`
        });
        this.store.dispatch(this.actions.removeCartItemsSuccess());
      }).catch(err => Observable.empty());
  }


  /**
   *
   *
   * @param {CartItem} cartItem
   * @returns
   *
   * @memberof CheckoutService
   */
  updateCartItem(cartItem: CartItem) {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id: 0;
    return this.http.put(`v1/orderItem/${cartItem.id}`, {
        "user_id": userId,
        "item_id": cartItem.item.id,
        "quantity": cartItem.quantity,
        "orderkey": this.getOrderKey(),
        "specialInstructions": cartItem.instructions,
      }
    ).map((res) => {
      return cartItem;
    }).catch(err => Observable.empty());
  }

  /**
    * @param {any} gcCode
    * @returns
    *
    * @memberof CheckoutService
    */
  getGC(gcCode) {
    console.log("SEARCHING FOR GIFTCERT");
    return this.http.get(`v1/gc/${gcCode}`).map(res => {
      const gc = res.json();
      return gc;
   }).catch(err => Observable.empty());
  }

  /**
    * @param {any} vCode
    * @returns
    *
    * @memberof CheckoutService
    */
  getvoucher(vCode) {
        console.log("SEARCHING FOR VOUCHER");
        return this.http.get(`v1/voucher/${vCode}`).map(res => {
          const v = res.json();
          return v;
       }).catch(err => Observable.empty());
  }

  /**
    * @param {any} orderId
    * @returns
    *
    * @memberof CheckoutService
    */
  getTransaction(orderId) {
        console.log("SEARCHING FOR TRANSACTION");
        return this.http.get(`v1/transactions/${orderId}`).map(res => {
          return res.json();
       }).catch(err => Observable.empty());
  }

  /**
    * @param {any} vCode
    * @returns
    *
    * @memberof CheckoutService
    */
  updateVoucherStatus(vCode) {
    return this.http.put(`v1/voucher/${vCode}`,{
      status:'consumed'
      }).map(res => {
        return res.json();
    }).catch(err => Observable.empty());
  }

  /**
    * @param {any} gcCode
    * @returns
    *
    * @memberof CheckoutService
    */
  updateGC_status(gcCode) {
    return this.http.put(`v1/gc/${gcCode}`,{
      status:'used'
      }).map(res => {
        return res.json();
    }).catch(err => Observable.empty());
  }

  /**
   *
   *
   * @param {any} params
   * @returns
   *
   * @memberof CheckoutService
   */
  updateOrder(params: any) {
    const orderkey = this.getOrderKey();
    return this.http.put(`v1/order/${orderkey}`, params).map((res) => {
      const order = res.json();
      switch (params.status) {
        case 'cart': console.log("UPDATE CART")
          this.store.dispatch(this.actions.updateOrderSuccess({status: 'address'}));
          break;
        case 'address': console.log("UPDATE ADDRESS")
          const address = {
            'shippingAddress': {
              'firstname': params.firstname,
              'lastname': params.lastname,
              'phone': params.phone,
              'shippingAddress01': params.shippingAddress01,
              'shippingAddress02': params.shippingAddress02,
              'email': params.email,
              'city': params.city,
              'postalcode': params.postalcode,
              'country': params.country,
              'specialInstructions': params.specialInstructions,
              'userAccountId': params.useraccount_id,
            },
            'billingAddress': {
              'billCity': params.billCity,
              'billCountry': params.billCountry,
              'billingAddress01': params.billingAddress01,
              'billingAddress02': params.billingAddress02,
              'billPostalcode': params.billPostalcode
            },
            'status': 'timeslot'
          }
          this.store.dispatch(this.actions.updateOrderAddressSuccess(address));
          break;
        case 'timeslot': console.log("UPDATE DELIVERY")
          break;
        // case 'payment':
        //   break;
        // case: 'confirm':
        //   break;
      }

    }).catch(err => Observable.empty());
  }

  updateOrderPayment(params: any) {
    console.log(params);
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id: 0;
    params['useraccount_id']= userId;
    params['orderkey'] = this.getOrderKey();
    this.orderIdContainer = params.id;
    return this.http.put(`v1/order/${params.id}/payment/`, params)
    .map(res => {
      const response = res.json();
      if(response.message.indexOf('Processed') >= 0) {
        // this.getTransaction(params.id).subscribe(res => {
        //   if(res){
        //     let trans: any = {};
        //     trans = {
        //         order_id:this.orderIdContainer,
        //         value: params.paymentTotal,
        //         type: params.paymentType,
        //     }
        //     console.log(trans);
        //     this.updateTransaction(trans).subscribe();
        //   }
        // });
        this.store.dispatch(this.actions.orderCompleteSuccess());
        this.createNewOrder().subscribe();
      } else {
          this.showErrorMsg('payment',response.message);
      }
      return response;
    })
  }

  createTransaction(params: any){
    const order = JSON.parse(localStorage.getItem('order'));
    const orderId = order ? order.id: 0;
    params['number'] = this.getOrderKey();
    params['order_id'] = orderId;
    return this.http.post(`v1/transactions/`, params)
    .map(res => {
      const response = res.json();
      return response;
    })

  }

  updateTransaction(params: any){
    console.log('update transaction');
    const order = JSON.parse(localStorage.getItem('order'));
    console.log(order);
    const order_id = this.orderIdContainer;
    console.log(this.orderIdContainer);
    // params['value'] = this.getOrderKey();
    return this.http.put(`v1/transactions/${order_id}`, params)
    .map(res => {
      const response = res.json();
      return response;
    })

  }

  getAllTimeSlot() {
    return this.http.get(`v1/timeslotorder`
    ).map((res) => {
      return res.json();
    })
  }

  getTimeSlotOrder(id: number) {
    return this.http.get(`v1/timeslotorder/${id}`
    ).map((res) => {
      return res.json();
    })
  }

  setTimeSlotOrder(params) {
    return this.http.post(`v1/timeslotorder`, params
    ).map((res) => {
      const response = res.json();
      if(response.message == 'Slot is full') {
        this.showErrorMsg('timeslot_full');
      } else if (response.message == 'Validation errors') {
        this.showErrorMsg('timeslot');
      }
      return response;
    })
    .catch(() => {
      return Observable.of(false);
    });
  }

  updateTimeSlotOrder(params) {
    return this.http.put(`v1/timeslotorder/${params.order_id}`, params
    ).map((res) => {
      const response = res.json();
      if(response.message == 'Slot is full') {
        this.showErrorMsg('timeslot_full');
      } else if (response.message == 'Validation errors') {
        this.showErrorMsg('timeslot');
      }
      return response;
    })
    .catch(() => {
      return Observable.of(false);
    });
  }

  /**
   *
   *
   * @param string
   * @returns void
   *
   * @memberof CheckoutService
   */

  showErrorMsg(mode: string, msg: string = ''): void {
    let message = '';
    switch (mode) {
      case 'address':
        message = `Please enter required information. ${msg}`;
        break;
      case 'timeslot':
        message = `Please select a delivery time slot.`;
        break;
      case 'timeslot_full':
        message = `Slot is already full. Please select another slot.`;
        break;
      case 'payment':
        message = `Error occured. ${msg} Please review your order and try again.`;
        break;
      case 'payment_gc':
        message = msg;
        break;
      case 'voucher':
        message = "Please enter a valid coupon.";
        break;
      case 'giftcert':
        message = msg;
        break;
      case 'pbuvoucher':
        message = msg;
        break;
    }
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
   *
   * @returns
   *
   * @memberof CheckoutService
   */
  getOrderKey() {
    const order = JSON.parse(localStorage.getItem('order'));
    let token = null;
    if(order) {
      token = order.order_token;
    }
    return token;
  }

  /**
   *
   *
   *
   * @returns
   *
   * @memberof CheckoutService
   */
  getOrderId() {
    const order = JSON.parse(localStorage.getItem('order'));
    let token = 0;
    if(order) {
      token = order.order_id;
    }
    return token;
  }

  /**
   *
   *
   * @private
   * @param {any} token
   *
   * @memberof CheckoutService
   */
  private setOrderTokenInLocalStorage(token): void {
    const jsonData = JSON.stringify(token);
    localStorage.setItem('order', jsonData);
  }

  /**
   *
   *
   * @private
   * @returns
   *
   * @memberof CheckoutService
   */
  private getOrderInLocalStorage() {
    const order = JSON.parse(localStorage.getItem('order'));
    return order;
  }

  /**
   *
   *
   * @private
   * @param {any} token
   *
   * @memberof CheckoutService
   */
  private setOrderInLocalStorage(params): void {
    const keys = Object.keys(params)
    keys.forEach(val => {
      // order[val]
    });
  }

  /**
   *
   *
   * @private
   * @param {any} []
   * @returns cartItem
   *
   * @memberof CheckoutService
   */
  private formatCartItem(datum): any {
    return {
      "id": datum.orderItem_id,
      "quantity": Number(datum.quantity),
      "price": Number(datum.price),
      "total": (Number(datum.price) * datum.quantity),
      "item_id": datum.item_id,
      "item": {
        "id": datum.item_id,
        "code": datum.code,
        "name": datum.name,
        "brandName": datum.brandName,
        "price": datum.price,
        "displayPrice": datum.displayPrice,
        "hasVat": datum.hasVat,
        "isSenior": datum.isSenior,
        "weighted": datum.weighted,
        "packaging": datum.packaging,
        "packageMeasurement": datum.packageMeasurement,
        "sizing": datum.sizing,
        "packageMinimum": datum.packageMinumum,
        "packageIntervals": datum.packageIntervals,
        "availableOn": datum.availableOn,
        "imageKey": datum.imageKey,
        "slug": datum.slug,
        "enabled": datum.enabled,
        "sellerAccount_id": datum.sellerAccount_id,
        "dateCreated": datum.dateCreated,
        "dateUpdated": datum.dateUpdate,
      },
      "instructions": datum.specialInstructions,
    }

  }
  // /**
  //  *
  //  *
  //  * @private
  //  * @returns
  //  *
  //  * @memberof CheckoutService
  //  */
  // private getGCfromLocalStorage() {
  //   const gc = JSON.parse(localStorage.getGC('code'));
  //   return gc;
  // }
}
