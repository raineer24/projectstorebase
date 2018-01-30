import { getAuthStatus } from './../../../auth/reducers/selectors';
import { AppState } from './../../../interfaces';
import { Store } from '@ngrx/store';
import { AuthActions } from './../../../auth/actions/auth.actions';
import { AddressService } from './../services/address.service';
import { CheckoutService } from './../../../core/services/checkout.service';
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
  emailForm: FormGroup;
  isAuthenticated: boolean;
  isInvalid: boolean;

  constructor(
    private fb: FormBuilder,
    private authActions: AuthActions,
    private checkoutService: CheckoutService,
    private addrService: AddressService,
    private store: Store<AppState>
  ) {
    this.addressForm = addrService.initAddressForm();
    this.emailForm = addrService.initEmailForm();
    this.store.select(getAuthStatus).subscribe(auth => {
      this.isAuthenticated = auth;
    });
  }

  ngOnInit() {
    this.isInvalid = false;
  }

  onSubmit() {
    console.log(this.addressForm.valid)
    const values = this.addressForm.value;

    if(this.addressForm.valid) {
      this.checkoutService.updateOrder({
        'shippingAddress01': values.address1,
        'shippingAddress02': values.address2,
        'email': values.email
      }).do(()=>{console.log("UPDATE ADDRESS")}).subscribe();
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
    console.log(this.addressForm);
    console.log(this.isInvalid);
  }

  private getEmailFromUser() {
    return this.emailForm.value.email;
  }

  ngOnDestroy() {}
}
