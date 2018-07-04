import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../../environments/environment';
import { AdminService } from '../../../services/admin.service';
import { CheckoutService } from '../../../../core/services/checkout.service';
import { UserService } from '../../../../user/services/user.service';
import { UserActions } from '../../../../user/actions/user.actions';


@Component({
  selector: 'app-order-assemble',
  templateUrl: './order-assemble.component.html',
  styleUrls: ['./order-assemble.component.scss']
})
export class OrderAssembleComponent implements OnInit {
  routeSubscription$: Subscription;
  orderSeller: any;
  orderItems: Array<any> = [];
  orderItemStatus: Array<any> = [];
  itemsQuantity: number = 0;
  itemsTotal: number = 0;
  itemsConfirmed: number = 0;
  itemsUnavailable: number = 0;
  userData: any;
  pbuData: any;
  transactions: Array<any> = [];
  MIN_VALUE = 1;
  MAX_VALUE = 9999;
  isCancelReason: boolean = false;
  @ViewChild('cancelModal') cancelModal;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private checkoutService: CheckoutService
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('selleruser'));
    this.routeSubscription$ = this.route.params.subscribe(
      (params: any) => {
        const orderSellerId = params['id'];
        this.adminService.getSellerOrder(orderSellerId).mergeMap(orderSeller => {
          this.orderSeller = orderSeller;
          if(orderSeller.selleraccount_id != this.userData.id) {
            this.router.navigate(['/admin/order-assemble']);
            return Observable.empty();
          }
          return this.adminService.getOrderItems(orderSeller.order_id).map(orderItems => {
            // NOTE: TEMPORARY ORDER ID 0
            // return this.adminService.getOrderItems(0).map(orderItems => {
            this.orderItems = orderItems;
            orderItems.forEach((item, index) => {
              item.quantity = Number(item.quantity);
              item.price = Number(item.price);
              item.finalQuantity = item.finalQuantity ? Number(item.finalQuantity) : item.quantity;
              item.finalPrice = item.finalPrice ? Number(item.finalPrice): item.price;
              this.orderItemStatus[item.orderItem_id] = item.status;
              switch (item.status) {
                case 'confirmed':
                  this.itemsConfirmed++;
                  this.itemsQuantity += Number(item.finalQuantity);
                  this.itemsTotal += Number(item.finalQuantity) * Number(item.price);
                  break;
                case 'unavailable':
                  this.itemsUnavailable++;
                  break;
              }
            })
            return orderItems;
          })
        }).subscribe(() => {
          this.adminService.getTransactionsPerOrder(this.orderSeller.order_id).subscribe((transactions) => {
            if (transactions.length) {
              this.transactions = transactions;
              const index = transactions.findIndex((trans) => {
                return trans.type === 'SALARY_DEDUCTION';
              });
              if (index >= 0) {
                this.adminService.getPartnerBuyerUser(this.orderSeller.useraccount_id).subscribe((pbu) => {
                  if (pbu.message == 'Found') {
                    this.pbuData = pbu;
                  }
                });
              }
            }
          });
        });
      }
    );
  }

  ngOnDestroy() {
    this.routeSubscription$.unsubscribe();
  }

  getProductImageUrl(key: string): string {
    let url = "";
    if (!key) {
      url = "assets/omg-04.png";
    } else {
      url = environment.IMAGE_REPO + key + ".jpg";
    }
    return url;
  }

  incrementQuantity(index: number): void {
    if (this.orderItems[index].finalQuantity < this.MAX_VALUE) {
      this.orderItems[index].finalQuantity++;
    }
  }

  decrementQuantity(index: number): void {
    if (this.orderItems[index].finalQuantity > this.MIN_VALUE) {
      this.orderItems[index].finalQuantity--;
    }
  }

  confirm(orderItem: any): void {
    orderItem.status = 'confirmed';
    const data = {
      id: orderItem.orderItem_id,
      item_id: orderItem.id,
      quantity: orderItem.quantity,
      finalQuantity: orderItem.finalQuantity,
      finalPrice: orderItem.finalPrice,
      status: 'confirmed',
    }
    this.recalculate();
    this.adminService.updateOrderItem(data).subscribe();
  }

  unavailable(orderItem: any): void {
    orderItem.status = 'unavailable';
    const data = {
      id: orderItem.orderItem_id,
      item_id: orderItem.id,
      quantity: orderItem.quantity,
      finalQuantity: '',
      finalPrice: '',
      status: 'unavailable',
    }
    this.recalculate();
    this.adminService.updateOrderItem(data).subscribe();
  }

  reset(orderItem: any): void {
    this.orderItemStatus[orderItem.orderItem_id] = 0;
    orderItem.status = 'ordered';
    orderItem.finalQuantity = orderItem.quantity;
    orderItem.finalPrice = orderItem.price;
    const data = {
      id: orderItem.orderItem_id,
      item_id: orderItem.id,
      quantity: orderItem.quantity,
      finalQuantity: '',
      finalPrice: '',
      status: 'ordered',
    }
    this.recalculate();
    this.adminService.updateOrderItem(data).subscribe();
  }

  updatePrice(e: any, orderItem: any): void {
    const value = Number(e.srcElement.value);
    if(isNaN(value)) {
      e.srcElement.value = orderItem.price;
    } else {
      orderItem.finalPrice = value;
    }
  }

  forwardToDelivery(): void {
    const difference = Number(this.orderSeller.itemTotal) - this.itemsTotal;
    const data = {
      order: {
        id: this.orderSeller.order_id,
        finalItemTotal: this.itemsTotal,
        finalTotalQuantity: this.itemsQuantity,
        total: Number(this.orderSeller.total) - difference,
        adjustmentTotal: Number(this.orderSeller.adjustmentTotal) - difference,
        paymentTotal: Number(this.orderSeller.paymentTotal) ? Number(this.orderSeller.paymentTotal) - difference : 0,
        status: 'assembled',
      },
      orderseller: {
        id: this.orderSeller.id,
        selleraccount_id: 0,
        status: 'assembled',
        updatedBy: this.userData.id,
      }
    }
    this.adminService.updateSellerOrder(data.orderseller).mergeMap((res) => {
      return this.adminService.updateOrder(data.order)
    }).subscribe(res => {
      if(res.message.indexOf('Updated') >= 0) {
        if (this.orderSeller.itemTotal != this.itemsTotal) {
          if (this.pbuData) {
            this.adminService.updatePartnerBuyerUser({
              useraccount_id: this.orderSeller.useraccount_id,
              availablebalance: Number(this.pbuData.availablebalance) + difference,
              outstandingbalance: Number(this.pbuData.outstandingbalance) - difference,
            }).subscribe();
          }
          this.updateTransactions();
        }
        this.router.navigate(['/admin/order-assemble']);
      }
    });
  }

  updateTransactions(): void {
    let difference = Number(this.orderSeller.itemTotal) - this.itemsTotal;
    const typeIndex = this.transactions.reduce((result, current, index) => {
      result[current.type] = index;
      return result;
    }, {});
    if(typeIndex.hasOwnProperty('CASH')) {
      difference = this.updateTransactionPerId(this.transactions[typeIndex['CASH']], difference);
    }
    if(typeIndex.hasOwnProperty('SALARY_DEDUCTION') && difference > 0) {
      difference = this.updateTransactionPerId(this.transactions[typeIndex['SALARY_DEDUCTION']], difference);
    }
    if(typeIndex.hasOwnProperty('PAYPAL') && difference > 0) {
      difference = this.updateTransactionPerId(this.transactions[typeIndex['PAYPAL']], difference);
    }
    if(typeIndex.hasOwnProperty('CREDIT_CARD') && difference > 0) {
      difference = this.updateTransactionPerId(this.transactions[typeIndex['CREDIT_CARD']], difference);
    }
    if(typeIndex.hasOwnProperty('DEBIT_CARD') && difference > 0) {
      difference = this.updateTransactionPerId(this.transactions[typeIndex['DEBIT_CARD']], difference);
    }
    if(typeIndex.hasOwnProperty('GIFT_CERTIFICATE') && difference > 0) {
      difference = this.updateTransactionPerId(this.transactions[typeIndex['GIFT_CERTIFICATE']], difference);
    }
  }

  updateTransactionPerId(transaction, amount): number {
    if (Number(transaction.value) < amount) {
      this.adminService.updateTransaction({
        id: transaction.id,
        value: 0,
        order_id: Number(transaction.order_id),
      }).subscribe();
      amount -= Number(transaction.value);
    } else {
      this.adminService.updateTransaction({
        id: transaction.id,
        value: Number(transaction.value) - amount,
        order_id: Number(transaction.order_id),
      }).subscribe();
      amount = 0;
    }
    return amount;
  }

  cancelOrder(comments: string): void {
    if(!comments) {
      this.isCancelReason = true;
    } else {
      const data = {
        id: this.orderSeller.id,
        selleraccount_id: 0,
        updatedBy: this.userData.id,
        status: 'cancelled',
        comments: comments
      }
      this.cancelModal.hide();
      this.adminService.updateSellerOrder(data).mergeMap(() => {
        return this.adminService.updateOrder({
          id: this.orderSeller.order_id,
          status: 'cancelled',
        })
      }).subscribe(res => {
        if(res.message.indexOf('Updated') >= 0) {
          if (this.pbuData) {
            this.adminService.updatePartnerBuyerUser({
              useraccount_id: this.orderSeller.useraccount_id,
              availablebalance: Number(this.pbuData.availablebalance) + Number(this.orderSeller.adjustmentTotal),
              outstandingbalance: Number(this.pbuData.outstandingbalance) - Number(this.orderSeller.adjustmentTotal),
            }).subscribe();
          }
          this.router.navigate(['/admin/order-assemble']);
        }
      });
    }
  }

  recalculate(): void {
    this.itemsConfirmed = 0;
    this.itemsUnavailable = 0;
    this.itemsQuantity = 0;
    this.itemsTotal = 0;
    this.orderItems.forEach(item => {
      switch (item.status) {
        case 'confirmed':
          this.itemsConfirmed++;
          this.itemsQuantity += Number(item.finalQuantity);
          this.itemsTotal += Number(item.finalQuantity) * Number(item.finalPrice);
          break;
        case 'unavailable':
          this.itemsUnavailable++;
          break;
      }
    });
  }

}
