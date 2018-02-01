import { FormBuilder, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { getShipAddress,getBillAddress } from './../../reducers/selectors';
import { AppState } from './../../../interfaces';
import { Store } from '@ngrx/store';

@Injectable()
export class AddressService {
  constructor(private fb: FormBuilder, private store: Store<AppState>) {}

  initAddressForm() {
    return this.fb.group({
      'firstname': ['', Validators.required],
      'lastname': ['', Validators.required],
      'shippingAddress01': ['', Validators.required],
      'shippingAddress02': '',
      'city': ['', Validators.required],
      'phone': ['', Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(11), Validators.pattern('[0-9]{7,11}')]) ],
      'email': ['', Validators.compose([Validators.required, Validators.email])],
      'postalcode': ['', Validators.required],
      'country': 'Philippines',
      'isBilling': false,
      'billingAddress01': '',
      'billingAddress02': '',
      'billCity': '',
      'billPostalcode': '',
      'billCountry': 'Philippines',
      'specialInstructions': ''
    });
  }


  initEmailForm() {
    return this.fb.group({
      'email': ['', Validators.required]
    });
  }

  createAddresAttributes(address) {
    return {
      'order': {
        'bill_address_attributes': address,
        'ship_address_attributes': address
      }
    };
  }

  createGuestAddressAttributes(address, email) {
    return {
      'order': {
        'email': email,
        'bill_address_attributes': address,
        'ship_address_attributes': address
      }
    };
  }

}
