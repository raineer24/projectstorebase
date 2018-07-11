import { CartItem } from './../../core/models/cart_item';
import { CheckoutActions } from './../actions/checkout.actions';
import { CheckoutState, CheckoutStateRecord } from './checkout.state';
import { Action, ActionReducer } from '@ngrx/store';


export const initialState: CheckoutState = new CheckoutStateRecord() as CheckoutState;

export const checkoutReducer: ActionReducer<CheckoutState> =
  (state: CheckoutState = initialState, { type, payload }: Action): CheckoutState => {
    let sFee = 0.00, dFee = 0.00, promo_sFee = 0.00, promo_dFee = 0.00;
    if(localStorage.getItem('settings')){
      let settings = localStorage.getItem('settings');
      settings = JSON.parse(settings);
      let sf = settings[0];
      let df = settings[1];
      let promo_sf = settings[2];
      let promo_df = settings[3];

      let tempSFee = sf[`value`];
      let tempDFee = df[`value`];

      promo_sFee = promo_sf[`value`];
      promo_dFee = promo_df[`value`];

      if(tempSFee > promo_sFee && tempDFee > promo_dFee) {
        sFee = promo_sFee;
        dFee = promo_dFee;
      } else {
        sFee = tempSFee;
        dFee = tempDFee
      }

    } else {
      sFee = 0.00;
      dFee = 0.00;
    }

    let _cartItems, _cartItemEntities, _cartItemIds,
        _cartItem, _cartItemEntity, _cartItemId,
        _totalCartItems = 0, _totalCartValue, _totalDiscount = 0, _totalAmountPaid = 0, _totalAmountDue = 0,
        _ship_address, _bill_address, _giftCerts, _deliveryFee = Number(dFee), _serviceFee = Number(sFee), _grandTotal = 0,
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
        } else if(localStorage.getItem('discount')!= '') {
          _totalDiscount = Number(localStorage.getItem('discount'));
        } else {
          _totalDiscount = 0;
        }

        if(payload.totalAmtPaid != null) {
          _totalAmountPaid = parseFloat(payload.totalAmtPaid);
        } else if(localStorage.getItem('payment') != '') {
          _totalAmountPaid = Number(localStorage.getItem('payment'));
        } else {
          _totalAmountPaid = state.totalAmountPaid;
        }

        _ship_address = {
          firstname: payload.firstname,
          lastname: payload.lastname,
          email: payload.email,
          phone: payload.phone,
          shippingAddress01: payload.shippingAddress01,
          shippingAddress02: payload.shippingAddress02,
          city: payload.city,
          country: payload.country,
          postalcode: payload.postalcode,
          specialInstructions: payload.specialInstructions,
          userAccountId: payload.useraccount_id,
        };;
        _bill_address = {
          billingAddress01: payload.billingAddress01,
          billingAddress02: payload.billingAddress02,
          billCity: payload.billCity,
          billCountry: payload.billCountry,
          billPostalcode: payload.billPostalcode,
        };
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
          serviceFee: _serviceFee,
          deliveryFee: _deliveryFee,
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

        if(_totalCartValue == 0)
        {
          localStorage.setItem('payment','');
          localStorage.setItem('giftcert','');
          localStorage.setItem('voucher','');
          localStorage.setItem('discount','');
        }

        return state.merge({
          cartItemIds: _cartItemIds,
          cartItemEntities: _cartItemEntities,
          totalCartItems: _totalCartItems,
          totalCartValue: _totalCartValue,
          totalAmountDue: _totalAmountDue,
          totalDiscount: _totalDiscount,
          grandTotal: _grandTotal,
          // giftCerts:_giftCerts
        }) as CheckoutState;

      case CheckoutActions.REMOVE_CART_ITEMS_SUCCESS:

        if(localStorage.getItem('discount')!= '') {
          _totalDiscount = Number(localStorage.getItem('discount'));
        } else {
          _totalDiscount = 0;
        }

        if(localStorage.getItem('payment') != '') {
          _totalAmountPaid = Number(localStorage.getItem('payment'));
        } else {
          _totalAmountPaid = state.totalAmountPaid;
        }

        _grandTotal = _totalCartValue + _serviceFee + _deliveryFee - _totalDiscount;
        _totalAmountDue = _grandTotal - _totalAmountPaid;

        localStorage.setItem('payment','');
        localStorage.setItem('giftcert','');
        localStorage.setItem('voucher','');
        localStorage.setItem('discount','');
        return state.merge({
          cartItemIds: [],
          cartItemEntities: {},
          totalCartItems: 0,
          totalCartValue: 0,
          totalAmountDue: _totalAmountDue,
          totalDiscount: _totalDiscount,
          grandTotal: _grandTotal,
          // giftCerts:_giftCerts
        }) as CheckoutState;

      case CheckoutActions.UPDATE_CART_ITEM_SUCCESS:
        const quantity = payload.cartItem.quantity;
        const instructions = payload.cartItem.instructions;
        _cartItemId = payload.cartItem.id;
        _cartItemEntities = state.cartItemEntities;
        _cartItem = _cartItemEntities.get(_cartItemId.toString()).toJS();

        const quantityDifference = quantity - _cartItem['quantity'];
        const total = _cartItem['price'] * quantityDifference;

        _cartItem['quantity'] = quantity;
        _cartItem['total'] = _cartItem['price'] * quantity;
        _cartItem['instructions'] = instructions;
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
        return state.merge({
          totalDiscount: _totalDiscount,
          grandTotal: _grandTotal,
          totalAmountDue: _totalAmountDue
        }) as CheckoutState;

      //case REMOVE COUPON when input changed
      case CheckoutActions.REMOVE_COUPON:
        _totalDiscount = 0;
        _grandTotal = state.totalCartValue + _serviceFee + _deliveryFee;
        _totalAmountDue = _grandTotal - state.totalAmountPaid ;
        return state.merge({
          totalDiscount: _totalDiscount,
          totalAmountDue: _totalAmountDue,
          grandTotal: _grandTotal
        }) as CheckoutState;

      //case APPLY GC
      case CheckoutActions.APPLY_GC:
        console.log('apply gc')
        _totalAmountPaid = state.totalAmountPaid + payload.value;
        _totalAmountDue = state.grandTotal - _totalAmountPaid;
        _giftCerts = state.giftCerts.push(payload.gCerts);
        localStorage.setItem('payment',JSON.stringify(_totalAmountPaid));
        localStorage.setItem('confirmationPayment',JSON.stringify(_totalAmountPaid));
        return state.merge({
          totalAmountPaid: _totalAmountPaid,
          totalAmountDue: _totalAmountDue,
          giftCerts: _giftCerts
      }) as CheckoutState;

      //case REMOVE GC
      case CheckoutActions.REMOVE_GC:
        console.log('remove gc');
        console.log(state.totalAmountPaid);
        console.log(payload.value);
        if(_totalAmountDue > 0){
          _totalAmountPaid = state.totalAmountPaid - payload.value;
          _totalAmountDue = state.grandTotal + _totalAmountPaid;
        } else {
          _totalAmountPaid = 0;
          _totalAmountDue = state.grandTotal;
        }
        var gcIndex = state.giftCerts.indexOf(payload.gCerts);
        console.log(state.giftCerts);
        state.giftCerts.splice(gcIndex, 1);
        console.log(state.giftCerts);
        _giftCerts = state.giftCerts;

        localStorage.setItem('payment',JSON.stringify(_totalAmountPaid));
        localStorage.setItem('confirmationPayment',JSON.stringify(_totalAmountPaid));
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
