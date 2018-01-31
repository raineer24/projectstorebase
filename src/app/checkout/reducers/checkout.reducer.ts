import { CartItem } from './../../core/models/cart_item';
import { CheckoutActions } from './../actions/checkout.actions';
import { CheckoutState, CheckoutStateRecord } from './checkout.state';
import { Action, ActionReducer } from '@ngrx/store';


export const initialState: CheckoutState = new CheckoutStateRecord() as CheckoutState;

export const checkoutReducer: ActionReducer<CheckoutState> =
  (state: CheckoutState = initialState, { type, payload }: Action): CheckoutState => {

    let _cartItems, _cartItemEntities, _cartItemIds,
        _cartItem, _cartItemEntity, _cartItemId,
        _totalCartItems = 0, _totalCartValue,
        _ship_address, _bill_address,
        _orderStatus, _orderNumber;

    switch (type) {

      case CheckoutActions.FETCH_CURRENT_ORDER_SUCCESS:
        _orderNumber = payload.number;
        _cartItems = payload.cartItems;
        _cartItemIds = _cartItems.map(cartItem => cartItem.id);
        _totalCartItems = Number(payload.totalQuantity);
        _totalCartValue = parseFloat(payload.total);
        _ship_address = payload.shippingAddress01;
        _bill_address = payload.billingAddress01;
        _orderStatus = payload.status;

        _cartItemEntities = _cartItems.reduce((cartItems: { [id: number]: CartItem }, cartItem: CartItem) => {
          return Object.assign(cartItems, {
            [cartItem.id]: cartItem
          });
        }, { });

        return state.merge({
          orderNumber: _orderNumber,
          orderStatus: _orderStatus,
          cartItemIds: _cartItemIds,
          cartItemEntities: _cartItemEntities,
          totalCartItems: _totalCartItems,
          totalCartValue: _totalCartValue,
          shipAddress: _ship_address,
          billAddress: _bill_address
        }) as CheckoutState;

      case CheckoutActions.ADD_TO_CART_SUCCESS:
        _cartItem = payload;
        _cartItemId = _cartItem.id;

        // return the same state if the item is already included.
        if (state.cartItemIds.includes(_cartItemId)) {
          return state;
        }

        _totalCartItems = state.totalCartItems + _cartItem.quantity;
        _totalCartValue = state.totalCartValue + parseFloat(_cartItem.total);
        _cartItemEntity = { [_cartItemId]: _cartItem };
        _cartItemIds = state.cartItemIds.push(_cartItemId);

        return state.merge({
          cartItemIds: _cartItemIds,
          cartItemEntities: state.cartItemEntities.merge(_cartItemEntity),
          totalCartItems: _totalCartItems,
          totalCartValue: _totalCartValue
        }) as CheckoutState;

      case CheckoutActions.REMOVE_CART_ITEM_SUCCESS:
        _cartItem = payload;
        _cartItemId = _cartItem.id;
        const index = state.cartItemIds.indexOf(_cartItemId);
        if (index >= 0) {
          _cartItemIds = state.cartItemIds.splice(index, 1);
          _cartItemEntities = state.cartItemEntities.delete(_cartItemId);
          _totalCartItems = state.totalCartItems - _cartItem.quantity;
          _totalCartValue = state.totalCartValue - parseFloat(_cartItem.total);
        }

        return state.merge({
          cartItemIds: _cartItemIds,
          cartItemEntities: _cartItemEntities,
          totalCartItems: _totalCartItems,
          totalCartValue: _totalCartValue
        }) as CheckoutState;

      case CheckoutActions.UPDATE_CART_ITEM_SUCCESS:
        const quantity = payload.quantity;
        _cartItemId = payload.cartItemId;
        _cartItemEntities = state.cartItemEntities;
        _cartItem = _cartItemEntities.get(_cartItemId.toString()).toJS();

        const quantityDifference = quantity - _cartItem['quantity'];
        const total = _cartItem['price'] * quantityDifference;

        _cartItem['quantity'] = quantity;
        _cartItem['total'] = _cartItem['price'] * quantity;
        _cartItemEntity = { [_cartItemId]: _cartItem }
        _totalCartItems = state.totalCartItems + quantityDifference;
        _totalCartValue = state.totalCartValue + total;

        return state.merge({
          cartItemEntities: state.cartItemEntities.merge(_cartItemEntity),
          totalCartItems: _totalCartItems,
          totalCartValue: _totalCartValue
        }) as CheckoutState;

      // case CheckoutActions.CHANGE_ORDER_STATE:

      case CheckoutActions.CREATE_NEW_ORDER_SUCCESS:
        _orderNumber = payload.orderId;
        _orderStatus = payload.status;

        return state.merge({
          orderNumber: _orderNumber,
          orderStatus: _orderStatus
        }) as CheckoutState;

      case CheckoutActions.CHANGE_ORDER_STATE_SUCCESS:
        _orderStatus = payload.status;

        return state.merge({
          orderStatus: _orderStatus
        }) as CheckoutState;

      case CheckoutActions.UPDATE_ORDER_SUCCESS:
        _ship_address = payload.shippingAddress01;
        _bill_address = payload.billingAddress01;

        return state.merge({
          shipAddress: _ship_address,
          billAddress: _bill_address
        }) as CheckoutState;

      case CheckoutActions.ORDER_COMPLETE_SUCCESS:
        return initialState;

      default:
        return state;
    }
  };
