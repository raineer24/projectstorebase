import { CartItem } from './../../core/models/cart_item';
import { CheckoutActions } from './../actions/checkout.actions';
import { CheckoutState, CheckoutStateRecord } from './checkout.state';
import { Action, ActionReducer } from '@ngrx/store';


export const initialState: CheckoutState = new CheckoutStateRecord() as CheckoutState;

export const checkoutReducer: ActionReducer<CheckoutState> =
  (state: CheckoutState = initialState, { type, payload }: Action): CheckoutState => {

    let _cartItems, _cartItemEntities, _cartItemIds,
        _cartItem, _cartItemEntity, _cartItemId,
        _totalCartItems = 0, _totalCartValue, _totalDiscount = 0, _totalAmountPaid = 0, _totalAmountDue = 0,
        _ship_address, _bill_address, _giftCerts, _deliveryFee = 100, _serviceFee = 100, _grandTotal = 0,
        _orderStatus, _orderId, _deliveryDate;

    switch (type) {

      case CheckoutActions.FETCH_CURRENT_ORDER_SUCCESS:
        _orderId = payload.id;
        _cartItems = payload.cartItems;
        _cartItemIds = _cartItems.map(cartItem => cartItem.id);
        _totalCartItems = Number(payload.totalQuantity);
        _totalCartValue = parseFloat(payload.itemTotal);

        if(_totalCartValue > 0){
          _totalCartValue = _totalCartValue - _totalDiscount;
        } else {
          _totalCartValue = 0;
        }

        if(payload.totalDiscount != null){
            _totalDiscount = parseFloat(payload.totalDiscount);
        } else {
            _totalDiscount = 0;
        }

        if(payload.totalAmtPaid != null) {
          _totalAmountPaid = parseFloat(payload.totalAmtPaid);
        } else {
          _totalAmountPaid = 0;
        }

        _ship_address = payload.shippingAddress01;
        _bill_address = payload.billingAddress01;
        _orderStatus = payload.status;
        _deliveryDate = payload.deliveryDate;
        _grandTotal = _totalCartValue + _serviceFee + _deliveryFee - _totalDiscount;
        _totalAmountDue = _grandTotal - _totalAmountPaid;

        _cartItemEntities = _cartItems.reduce((cartItems: { [id: number]: CartItem }, cartItem: CartItem) => {
          return Object.assign(cartItems, {
            [cartItem.id]: cartItem
          });
        }, { });

        return state.merge({
          orderId: _orderId,
          orderStatus: _orderStatus,
          cartItemIds: _cartItemIds,
          cartItemEntities: _cartItemEntities,
          totalCartItems: _totalCartItems,
          totalCartValue: _totalCartValue,
          totalDiscount: _totalDiscount,
          totalAmountPaid: _totalAmountPaid,
          totalAmountDue: _totalAmountDue,
          grandTotal: _grandTotal,
          shipAddress: _ship_address,
          billAddress: _bill_address,
          deliveryDate: _deliveryDate,
          // giftCerts: _giftCerts
        }) as CheckoutState;

      case CheckoutActions.ADD_TO_CART_SUCCESS:
        _cartItem = payload;
        _cartItemId = _cartItem.id;

        // return the same state if the item is already included.
        if (state.cartItemIds.includes(_cartItemId) || !_cartItem.id) {
          return state;
        }

        _totalCartItems = state.totalCartItems + _cartItem.quantity;
        _totalCartValue = state.totalCartValue + parseFloat(_cartItem.total);
        _grandTotal = _totalCartValue + _serviceFee + _deliveryFee - _totalDiscount;
        _cartItemEntity = { [_cartItemId]: _cartItem };
        _cartItemIds = state.cartItemIds.push(_cartItemId);
        _totalAmountDue = _grandTotal - _totalAmountPaid;

        return state.merge({
          cartItemIds: _cartItemIds,
          cartItemEntities: state.cartItemEntities.merge(_cartItemEntity),
          totalCartItems: _totalCartItems,
          totalCartValue: _totalCartValue,
          grandTotal: _grandTotal,
          totalAmountDue: _totalAmountDue,
          // giftCerts: _giftCerts
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
          _grandTotal = _totalCartValue + _serviceFee + _deliveryFee - _totalDiscount;
          _totalAmountDue = _grandTotal - _totalAmountPaid ;
        }

        return state.merge({
          cartItemIds: _cartItemIds,
          cartItemEntities: _cartItemEntities,
          totalCartItems: _totalCartItems,
          totalCartValue: _totalCartValue,
          totalAmountDue: _totalAmountDue,
          totalDiscount: _totalDiscount,
          // giftCerts:_giftCerts
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
        _grandTotal = _totalCartValue + _serviceFee + _deliveryFee - _totalDiscount;
        _totalAmountDue = _grandTotal - _totalAmountPaid;

        return state.merge({
          cartItemEntities: state.cartItemEntities.merge(_cartItemEntity),
          totalCartItems: _totalCartItems,
          totalCartValue: _totalCartValue,
          grandTotal: _grandTotal,
          totalAmountDue: _totalAmountDue,
          // giftCerts: _giftCerts
        }) as CheckoutState;

      //case APPLY COUPON
      case CheckoutActions.APPLY_COUPON:
        _totalDiscount = payload.value;
        _grandTotal = state.totalCartValue + _serviceFee + _deliveryFee - _totalDiscount;
        _totalAmountDue = _grandTotal - state.totalAmountPaid;
        // _totalCartValue = _totalCartValue - _totalDiscount;
        // console.log(_totalCartValue);
        return state.merge({
          totalDiscount: _totalDiscount,
          grandTotal: _grandTotal,
          totalAmountDue: _totalAmountDue
        }) as CheckoutState;

      //case REMOVE COUPON when input changed
      case CheckoutActions.REMOVE_COUPON:
        _totalDiscount = 0;
        _totalAmountDue = state.grandTotal;
        // _totalAmountDue = payload.amtDue;
        // _totalCartValue = _totalCartValue - _totalDiscount;
        // console.log(_totalCartValue);
        return state.merge({
          totalDiscount: _totalDiscount,
          totalAmountDue: _totalAmountDue
        }) as CheckoutState;

      //case APPLY GC
      case CheckoutActions.APPLY_GC:
        _totalAmountPaid = state.totalAmountPaid + payload.value;
        _totalAmountDue = state.grandTotal - _totalAmountPaid;
        _giftCerts = state.giftCerts.push(payload.gCerts);
        return state.merge({
          totalAmountPaid: _totalAmountPaid,
          totalAmountDue: _totalAmountDue,
          giftCerts: _giftCerts
      }) as CheckoutState;

      // case CheckoutActions.CHANGE_ORDER_STATE:

      case CheckoutActions.CHANGE_ORDER_STATE_SUCCESS:
        _orderStatus = payload.status;

        return state.merge({
          orderStatus: _orderStatus
        }) as CheckoutState;

      case CheckoutActions.UPDATE_ORDER_SUCCESS:
        _orderStatus = payload.status;

        return state.merge({
          orderStatus: _orderStatus
        }) as CheckoutState;

      case CheckoutActions.UPDATE_ADDRESS_SUCCESS:
        _orderStatus = payload.status;
        _ship_address = payload.shippingAddress;
        _bill_address = payload.billingAddress;

        return state.merge({
          orderStatus: _orderStatus,
          shipAddress: _ship_address,
          billAddress: _bill_address
        }) as CheckoutState;

      case CheckoutActions.UPDATE_DELIVERY_OPTIONS_SUCCESS:
        _orderStatus = payload.status;
        _deliveryDate = payload.date;

        return state.merge({
          orderStatus: _orderStatus,
          deliveryDate: _deliveryDate
        }) as CheckoutState;

      case CheckoutActions.ORDER_COMPLETE_SUCCESS:
        return initialState;

      default:
        return state;
    }
  };
