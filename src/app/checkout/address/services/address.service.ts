import { FormBuilder, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { getShipAddress,getBillAddress } from './../../reducers/selectors';
import { AppState } from './../../../interfaces';
import { Store } from '@ngrx/store';

@Injectable()
export class AddressService {
  constructor(private fb: FormBuilder, private store: Store<AppState>) {}

  initAddressForm(auth) {
    if(auth){
      let storedData = JSON.parse(localStorage.getItem('user'));
      return this.fb.group({
        'lastname': [storedData.lastName, Validators.required],
        'firstname': [storedData.firstName, Validators.required],
        'shippingAddress01': ['', Validators.required],
        'shippingAddress02': '',
        'city': ['', Validators.required],
        'phone': [storedData.mobileNumber, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(11), Validators.pattern('[0-9]{7,11}')]) ],
        'landline': ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(7), Validators.pattern('[0-9]{6,7}')]) ],
        'email': [storedData.email, Validators.compose([Validators.required, Validators.email]) ],
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

    }else{
      console.log('Not logged in!');
      return this.fb.group({
        'firstname': ['', Validators.required],
        'lastname': ['', Validators.required],
        'shippingAddress01': ['', Validators.required],
        'shippingAddress02': '',
        'city': ['', Validators.required],
        'phone': ['', Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(11), Validators.pattern('[0-9]{7,11}')]) ],
        'landline': ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(7), Validators.pattern('[0-9]{6,7}')]) ],
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
