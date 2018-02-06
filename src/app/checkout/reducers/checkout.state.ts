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
  billAddress: any;
  shipAddress: any;
}

export const CheckoutStateRecord = Record({
  orderId: 0,
  orderNumber: null,
  orderStatus: null,
  cartItemIds: List([]),
  cartItemEntities: Map({}),
  totalCartItems: 0,
  totalCartValue: 0,
  billAddress: fromJS({}),
  shipAddress: fromJS({})
});
