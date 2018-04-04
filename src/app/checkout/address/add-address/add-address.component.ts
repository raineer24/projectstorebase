import { getAuthStatus } from './../../../auth/reducers/selectors';
import { AppState } from './../../../interfaces';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AuthActions } from './../../../auth/actions/auth.actions';
import { AddressService } from './../services/address.service';
import { CheckoutService } from './../../../core/services/checkout.service';
import { CheckoutActions } from './../../actions/checkout.actions';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { getShipAddress, getBillAddress } from './../../reducers/selectors';


@Component({
  selector: "app-add-address",
  templateUrl: "./add-address.component.html",
  styleUrls: ["./add-address.component.scss"]
})
export class AddAddressComponent implements OnInit, OnDestroy {
  @Output() onProceedClickEmit: EventEmitter<string> = new EventEmitter();
  addressForm: FormGroup;
  isAuthenticated: boolean;
  shipAddress$: Observable<any>;
  billAddress$: Observable<any>;
  checkBilling: boolean = false;
  private componentDestroyed: Subject<any> = new Subject();
  prefix: any[] = ['+63', '+62', '+61'];
  _selectedVal: any;
  constructor(
    private fb: FormBuilder,
    private authActions: AuthActions,
    private checkoutActions: CheckoutActions,
    private checkoutService: CheckoutService,
    private addrService: AddressService,
    private store: Store<AppState>
  ) {

    this.store.select(getAuthStatus).takeUntil(this.componentDestroyed).subscribe(auth => {
      this.isAuthenticated = auth;
      this.addressForm = addrService.initAddressForm(auth);
    });
    this.store.select(getShipAddress).takeUntil(this.componentDestroyed).subscribe(data => {
      if(data)
        this.addressForm.patchValue(data);
        if(data.phone) {
          const mobileNumber = data.phone.split(" ");
          this.addressForm.patchValue({'prefix': mobileNumber[0], 'phone': mobileNumber[1]});
        }
    });
    this.store.select(getBillAddress).takeUntil(this.componentDestroyed).subscribe(data => {
      if(data && data.billingAddress01) {
        this.addressForm.patchValue({'isBilling': true})
        this.addressForm.patchValue(data);
      }
    });
  }

  ngOnInit() {

  }
  // selected($event) {
  //   console.log(this.prefix);
  // }

  onSubmit() {
    console.log(this._selectedVal);
    let values = this.addressForm.value;
    let addressFields = ['firstname','lastname','email','phone','shippingAddress01','city','postalcode','country','prefix'];
    let requiredFields = !values.isBilling ? addressFields: addressFields.concat(['billingAddress01','billCity','billPostalcode','billCountry'])
    let hasError = false;
    
    requiredFields.forEach(val => {
      const ctrl = this.addressForm.controls[val];
      if (!ctrl.valid) {
        ctrl.markAsTouched();
        hasError = true;
      };
      // console.log(requiredFields[val] + " " +this.addressForm.controls[requiredFields[val]].errors?.required);
      // console.log(val +" "+ this.addressForm.hasError('required', [val]))
    });

    if(!hasError) {
      values.phone = this._selectedVal +" "+ values.phone;
      delete values.isBilling;
      delete values.prefix;
      values.status = 'address';
      console.log(values);
      this.checkoutService.updateOrder(values).subscribe();
      this.onProceedClickEmit.emit();
    } else {
      this.checkoutService.showErrorMsg('address');
    }
  }

  showBillingAddr() {
    this.addressForm.value.isBilling = !this.addressForm.value.isBilling;

  }

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.unsubscribe();
  }
}
