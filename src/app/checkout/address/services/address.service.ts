import { FormBuilder, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { getShipAddress } from './../../reducers/selectors';
import { AppState } from './../../../interfaces';
import { Store } from '@ngrx/store';

@Injectable()
export class AddressService {
  constructor(private fb: FormBuilder, private store: Store<AppState>) {}

  initAddressForm() {
    return this.store.select(getShipAddress).map(res => {
      const addrData = res;
      if(!addrData) { console.log("FALST")
        return this.fb.group({
          'firstname': ['', Validators.required],
          'lastname': ['', Validators.required],
          'address1': ['', Validators.required],
          'address2': '',
          'city': ['', Validators.required],
          'phone': ['', Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(11), Validators.pattern('[0-9]{7,11}')]) ],
          'email': ['', Validators.compose([Validators.required, Validators.email])],
          'zipcode': ['', Validators.required],
          'country': 'Philippines'
        });
      } else { console.log("TRUE")
        return this.fb.group({
          'firstname': [addrData.firstName, Validators.required],
          'lastname': [addrData.lastName, Validators.required],
          'address1': [addrData.shippingAddress01, Validators.required],
          'address2': addrData.shippingAddress02,
          'city': [addrData.city, Validators.required],
          'phone': [addrData.phone, Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(11), Validators.pattern('[0-9]{7,11}')]) ],
          'email': [addrData.email, Validators.compose([Validators.required, Validators.email])],
          'zipcode': [addrData.zipCode, Validators.required],
          'country': addrData.country
        });
      }

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
