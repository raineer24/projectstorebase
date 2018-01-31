import { getAuthStatus } from './../../../auth/reducers/selectors';
import { AppState } from './../../../interfaces';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { AuthActions } from './../../../auth/actions/auth.actions';
import { AddressService } from './../services/address.service';
import { CheckoutService } from './../../../core/services/checkout.service';
import { CheckoutActions } from './../../actions/checkout.actions';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';


@Component({
  selector: "app-add-address",
  templateUrl: "./add-address.component.html",
  styleUrls: ["./add-address.component.scss"]
})
export class AddAddressComponent implements OnInit, OnDestroy {
  @Output() onProceedClickEmit: EventEmitter<string> = new EventEmitter();
  addressForm: FormGroup;
  isAuthenticated: boolean;
  addrSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private authActions: AuthActions,
    private checkoutActions: CheckoutActions,
    private checkoutService: CheckoutService,
    private addrService: AddressService,
    private store: Store<AppState>
  ) { console.log("INIT")
    this.addrSub = addrService.initAddressForm().subscribe(data => {
      this.addressForm = data;
    });
    this.store.select(getAuthStatus).subscribe(auth => {
      this.isAuthenticated = auth;
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    const values = this.addressForm.value;

    if(this.addressForm.valid) {
      const addrData = {
        'firstName': values.firstname,
        'lastName': values.lasttname,
        'phone': values.phone,
        'shippingAddress01': values.address1,
        'shippingAddress02': values.address2,
        'email': values.email,
        'city': values.city,
        'zipCode': values.zipcode,
        'country': values.country
      }
      this.checkoutService.updateOrder(addrData, 'address').do(()=>{console.log("UPDATE ADDRESS")}).subscribe();
      this.onProceedClickEmit.emit();
    } else {
      const keys = Object.keys(values)
      keys.forEach(val => {
        const ctrl = this.addressForm.controls[val];
        if (!ctrl.valid) {
          ctrl.markAsTouched();
        };
      });

    }
  }

  ngOnDestroy() {
    this.addrSub.unsubscribe();
  }
}
