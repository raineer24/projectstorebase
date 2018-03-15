import { Address } from './../../core/models/address';
import { CartItem } from './../../core/models/cart_item';
import { Map, Record, List, fromJS } from 'immutable';

export interface CheckoutState extends Map<string, any> {
  orderId: number;
  orderNumber: string;
  orderStatus: string;
  cartItemIds: List<number>;
  cartItemEntities: Map<number, CartItem>;
  totalCartItems: number;
  totalCartValue: number;
  totalDiscount: number;
  totalAmountPaid: number;
  totalAmountDue: number;
  grandTotal: number;
  billAddress: any;
  shipAddress: any;
  deliveryDate: any;
  giftCerts: List<any>;
}

export const CheckoutStateRecord = Record({
  orderId: 0,
  orderNumber: null,
  orderStatus: null,
  cartItemIds: List([]),
  cartItemEntities: Map({}),
  totalCartItems: 0,
  totalCartValue: 0,
  totalDiscount: 0,
  totalAmountPaid: 0,
  totalAmountDue: 0,
  grandTotal:0,
  billAddress: fromJS({}),
  shipAddress: fromJS({}),
  deliveryDate: fromJS({}),
  giftCerts: List([])
});
