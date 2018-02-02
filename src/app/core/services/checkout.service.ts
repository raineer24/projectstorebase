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
      this.store.select(getOrderNumber)
        .subscribe(number => this.orderNumber = number);
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
    // return this.http.post(
    //   `spree/api/v1/orders/${this.orderNumber}/line_items?order_token=${this.getOrderKey()}`,
    //   {
    //     line_item: {
    //       variant_id: variant_id,
    //       quantity: 1
    //     }
    //   }
    // ).map(res => {
    //   const lineItem: CartItem =  res.json();
    //   return lineItem;
    // }).catch(err => Observable.empty());

    return this.http.post(`v1/orderItem`,
        {
          "user_id": 0,
          "item_id": item.id,
          "quantity": 1,
          "orderkey": this.getOrderKey()
        }
      ).map(res => {
          const data = res.json();
          const returnData = {
           "id": data.id,
           "quantity": 1,
           "price": Number(item.price),
           "total": Number(item.price),
           "item_id": item.id,
           "item": item
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
  fetchCurrentOrder() {
    const orderStorage = this.getOrderInLocalStorage();
    const orderkey = orderStorage != null ? orderStorage.order_token: null;
    if(orderkey) { console.log("CURRENT ORDER KEY")
      return this.http.get(`v1/order?orderkey=${orderkey}`
      ).map(res => res.json()
      ).mergeMap(order => {
        if(order.id) { console.log("FETCH CURRENT ORDER")
          return this.http.get(`v1/orderItem?key=${orderkey}`
          ).map(res2 => {
            let cart_items = [], total = 0, total_quantity = 0;
            const data = res2.json();
            for (let datum of data) {
              cart_items.push(this.formatCartItem(datum));
              total += Number(datum.price) * datum.quantity;
              total_quantity += Number(datum.quantity);
            }
            order.cartItems =  cart_items;
            order.totalQuantity = total_quantity.toString();
            order.total = total.toString();
            order.shippingAddress01 = orderStorage.shipping_address;
            order.billingAddress01 = orderStorage.billing_address;
            return this.store.dispatch(this.actions.fetchCurrentOrderSuccess(order));
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

    return this.http.get(`v1/orderkey`
    ).map(res => res.json()
    ).mergeMap(data => {
      const orderkey = data.orderkey;
      this.setOrderTokenInLocalStorage({
        order_token: orderkey,
        shipping_address: '',
        billing_address: ''
      });
      return this.http.post('v1/order', {
          orderkey: orderkey,
          status: 'cart'
        }).map(orderId => {
          let order = new Order;
          order.id = orderId.json()['id'];
          order.number = "0";
          order.orderkey = orderkey;
          order.cartItems =  [];
          order.totalQuantity = "0";
          order.total = "0";
          order.shippingAddress01 = '';
          order.billingAddress01 = '';
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
  getOrder(orderNumber) {
    return this.http.get(
      `spree/api/v1/orders/${orderNumber}.json`
    ).map(res => {
      const order = res.json();
      return order;
    }).catch(err => Observable.empty());
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
      .map(() => {
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
  updateCartItem(cartItem: CartItem) {
    return this.http.put(`v1/orderItem/${cartItem.id}`,
        {
          "user_id": 0,
          "item_id": cartItem.item.id,
          "quantity": cartItem.quantity,
          "orderkey": this.getOrderKey()
        }
    ).map((res) => {
      return cartItem;
    }).catch(err => Observable.empty());
  }


  /**
   *
   *
   * @returns
   *
   * @memberof CheckoutService
   */
  changeOrderState() {
    return this.http.put(
      `spree/api/v1/checkouts/${this.orderNumber}/next.json?order_token=${this.getOrderKey()}`,
      {}
    ).map((res) => {
      const order = res.json();
      this.store.dispatch(this.actions.changeOrderStateSuccess(order));
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
  updateOrder(params, mode) {
    const orderkey = this.getOrderKey();
    return this.http.put(
      // `spree/api/v1/checkouts/${this.orderNumber}.json?order_token=${this.getOrderKey()}`,
      `v1/order/${orderkey}`,
      params
    ).map((res) => {
      const order = res.json();
      switch (mode) {
        case 'cart':
          this.store.dispatch(this.actions.updateOrderSuccess(params));
          break;
        case 'address':
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
              'specialInstructions': params.specialInstructions
            },
            'billingAddress': {
              'billCity': params.billCity,
              'billCountry': params.billCountry,
              'billingAddress01': params.billingAddress01,
              'billingAddress02': params.billingAddress02,
              'billPostalcode': params.billPostalcode
            }
          }
          this.setOrderTokenInLocalStorage(
            {
              order_token: orderkey,
              shipping_address: address.shippingAddress,
              billing_address: address.billingAddress
            }
          )
          this.store.dispatch(this.actions.updateOrderAddressSuccess(address));
          break;
        case 'delivery':
          this.store.dispatch(this.actions.updateOrderDeliveryOptionsSuccess(params));
          break;
      }

    }).catch(err => Observable.empty());
  }

  getAllTimeSlot() {
    return this.http.get(`v1/timeslotorder`
    ).map((res) => {
      return res.json();
    })
  }

  setTimeSlotOrder(params) {
    return this.http.post(`v1/timeslotorder/${params.orderId}`, params
    ).map((res) => {
      return res.json();
    })
  }

  updateTimeSlotOrder(params) {
    return this.http.put(`v1/timeslotorder/${params.orderId}`, params
    ).map((res) => {
      return res.json();
    })
  }

  /**
   *
   *
   * @returns
   *
   * @memberof CheckoutService
   */
  availablePaymentMethods() {
    return this.http.get(
      `spree/api/v1/orders/${this.orderNumber}/payments/new?order_token=${this.getOrderKey()}`
    ).map((res) => {
      const payments = res.json();
      return payments;
    }).catch(err => Observable.empty());
  }

  /**
   *
   *
   * @param {any} paymentModeId
   * @param {any} paymentAmount
   * @returns
   *
   * @memberof CheckoutService
   */
  createNewPayment(paymentModeId, paymentAmount) {
    return this.http.post(
      `spree/api/v1/orders/${this.orderNumber}/payments?order_token=${this.getOrderKey()}`,
      {
        payment: {
          payment_method_id: paymentModeId,
          amount: paymentAmount
        }
      }
    ).map((res) => {
      this.changeOrderState()
        .subscribe();
    }).catch(err => Observable.empty());
  }

  /**
   *
   *
   * @private
   * @returns
   *
   * @memberof CheckoutService
   */
  private getOrderKey() {
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
        "dateUpdated": datum.dateUpdate
      }
    }
  }
}
