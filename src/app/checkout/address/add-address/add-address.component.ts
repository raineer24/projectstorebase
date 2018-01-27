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

  barangays: string[] = ["Bakilid", "Basak", "Colon", "Fatima"];
  city: string[] = ["Catmon", "Carmen", "Cebu city", "Compostela"];
  province: string[] = ["Cavite", "Cebu", "Compostela Valley", "Leyte"];

  ngOnInit() {}

  onSubmit() {
    // const address = this.addressForm.value;
    // let addressAttributes;
    // if (this.isAuthenticated) {
    //   addressAttributes = this.addrService.createAddresAttributes(address);
    // } else {
    //   const email = this.getEmailFromUser();
    //   addressAttributes = this.addrService.createGuestAddressAttributes(
    //     address,
    //     email
    //   );
    // }
    // this.checkoutService.updateOrder(addressAttributes).subscribe();
    this.onProceedClickEmit.emit();
    console.log('Proceed!');
  }

  private getEmailFromUser() {
    return this.emailForm.value.email;
  }

  ngOnDestroy() {}
}
