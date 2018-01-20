import { getOrderNumber } from './../../checkout/reducers/selectors';
import { CheckoutActions } from './../../checkout/actions/checkout.actions';
import { Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Item } from './../models/item';
import { CartItem } from './../models/cart_item';
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
    //   `spree/api/v1/orders/${this.orderNumber}/line_items?order_token=${this.getOrderToken()}`,
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
          "orderkey": this.getOrderToken()
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

    //  const dummy = [{
    //   id: Math.random(),
    //   quantity: 1,
    //   price: Number(item.price),
    //   total: Number(item.price),
    //   item_id: item.id,
    //   item: item
    // }]

    // return dummy;
  }

  /**
   *
   *
   * @returns
   *
   * @memberof CheckoutService
   */
  fetchCurrentOrder() {
    // return this.http.get(
    //   'spree/api/v1/orders/current'
    // ).map(res => {
    //   const order = res.json();
    //   if (order) {
    //     const token = order.token;
    //     this.setOrderTokenInLocalStorage({order_token: token});
    //     return this.store.dispatch(this.actions.fetchCurrentOrderSuccess(order));
    //   } else {
    //     this.createEmptyOrder()
    //       .subscribe();
    //   }
    // }).catch(err => Observable.empty());

    let token = this.getOrderToken();
    if(!token) {
      token = Math.random() + "";
      this.setOrderTokenInLocalStorage({order_token: token});

      return Observable.create((observer: any) => {
        const order = {
          "number": token,
          "cart_items": [],
          "total_quantity": 0,
          "total": 0,
          "ship_address": "",
          "bill_address": "",
          "state": 'cart',
          "token": token
        }
        return this.store.dispatch(this.actions.fetchCurrentOrderSuccess(order));
      })
    } else {
      return this.http.get(`v1/orderItem?key=${token}`
      ).map(res => {
        // console.log("TEST"+data)
        const data = res.json();
        let cart_item = {}, cart_items = [], total = 0, total_quantity = 0;
        for (let datum of data) {
          cart_items.push({
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
          });

          total += Number(datum.price) * datum.quantity;
          total_quantity += Number(datum.quantity);
        }
        const order = {
          "number": token,
          "cart_items": cart_items,
          "total_quantity": total_quantity,
          "total": total,
          "ship_address": "",
          "bill_address": "",
          "state": 'cart',
          "token": token
        }
        return this.store.dispatch(this.actions.fetchCurrentOrderSuccess(order));
       })
    }
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
          "orderkey": this.getOrderToken()
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
      `spree/api/v1/checkouts/${this.orderNumber}/next.json?order_token=${this.getOrderToken()}`,
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
  updateOrder(params) {
    return this.http.put(
      `spree/api/v1/checkouts/${this.orderNumber}.json?order_token=${this.getOrderToken()}`,
      params
    ).map((res) => {
      const order = res.json();
      this.store.dispatch(this.actions.updateOrderSuccess(order));
    }).catch(err => Observable.empty());
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
      `spree/api/v1/orders/${this.orderNumber}/payments/new?order_token=${this.getOrderToken()}`
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
      `spree/api/v1/orders/${this.orderNumber}/payments?order_token=${this.getOrderToken()}`,
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
  private getOrderToken() {
    const order = JSON.parse(localStorage.getItem('order'));
    let token = null;
    if(order) {
      token = order.order_token;
      console.log("ESTS")
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
}
