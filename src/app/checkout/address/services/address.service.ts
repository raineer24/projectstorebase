import { FormBuilder, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { getShipAddress,getBillAddress } from './../../reducers/selectors';
import { AppState } from './../../../interfaces';
import { Store } from '@ngrx/store';

@Injectable()
export class AddressService {
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {
  }

  initAddressForm(auth) {
    if(auth){
      let storedData = JSON.parse(localStorage.getItem('user'));
      const mobileNumber = storedData.mobileNumber ? storedData.mobileNumber.split(" "): ['+63',''];
      return this.fb.group({
        'lastname': [storedData.lastName, Validators.required],
        'firstname': [storedData.firstName, Validators.required],
        'shippingAddress01': ['', Validators.required],
        'shippingAddress02': '',
        'city': ['', Validators.required],
        'prefix': [mobileNumber[0], Validators.required],
        'phone': [mobileNumber[1], Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]{10}')]) ],
        'landline': '',
        'email': [storedData.email, Validators.compose([Validators.required, Validators.email]) ],
        'postalcode': ['', Validators.required],
        'country': ['Philippines', Validators.required],
        'isBilling': false,
        'billingAddress01': ['', Validators.required],
        'billingAddress02': '',
        'billCity': ['', Validators.required],
        'billPostalcode': ['', Validators.required],
        'billCountry': ['Philippines', Validators.required],
        'specialInstructions': ''
      });
    } else {
      return this.fb.group({
        'firstname': ['', Validators.required],
        'lastname': ['', Validators.required],
        'shippingAddress01': ['', Validators.required],
        'shippingAddress02': '',
        'city': ['', Validators.required],
        'prefix': ['', Validators.required],
        'phone': ['', Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(11), Validators.pattern('[0-9]{10}')]) ],
        'landline': '',
        'email': '',
        'postalcode': ['', Validators.required],
        'country': ['Philippines', Validators.required],
        'isBilling': false,
        'billingAddress01': ['', Validators.required],
        'billingAddress02': '',
        'billCity': ['', Validators.required],
        'billPostalcode': ['', Validators.required],
        'billCountry': ['Philippines', Validators.required],
        'specialInstructions': ''
      });
  }
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
