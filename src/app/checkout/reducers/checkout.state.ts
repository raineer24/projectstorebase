import { Address } from './../../core/models/address';
import { CartItem } from './../../core/models/cart_item';
import { Map, Record, List, fromJS } from 'immutable';

export interface CheckoutState extends Map<string, any> {
  orderNumber: number;
  orderState: string;
  cartItemIds: List<number>;
  cartItemEntities: Map<number, CartItem>;
  totalCartItems: number;
  totalCartValue: number;
  billAddress: any;
  shipAddress: any;
}

export const CheckoutStateRecord = Record({
  orderNumber: null,
  orderState: null,
  cartItemIds: List([]),
  cartItemEntities: Map({}),
  totalCartItems: 0,
  totalCartValue: 0,
  billAddress: fromJS({}),
  shipAddress: fromJS({})
});
