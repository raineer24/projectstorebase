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
import { HttpService } from './../../../core/services/http';


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
  private componentDestroyed: Subject<any> = new Subject();

  constructor(
    private fb: FormBuilder,
    private authActions: AuthActions,
    private checkoutActions: CheckoutActions,
    private checkoutService: CheckoutService,
    private addrService: AddressService,
    private httpInterceptor: HttpService,
    private store: Store<AppState>
  ) {

    this.store.select(getAuthStatus).takeUntil(this.componentDestroyed).subscribe(auth => {
      this.isAuthenticated = auth;
      this.addressForm = addrService.initAddressForm(auth);
    });
    this.store.select(getShipAddress).takeUntil(this.componentDestroyed).subscribe(data => {
      if(data)
        this.addressForm.patchValue(data);
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

  onSubmit() {
    let values = this.addressForm.value;
    if(this.addressForm.valid) {
      if(!values.isBilling){
        values.billingAddress01 = '';
        values.billingAddress02 = '';
        values.billCity = '';
        values.billPostalcode = '';
        values.billCountry = '';
      }
      delete values.isBilling;
      values.status = 'address';
      this.checkoutService.updateOrder(values).subscribe();
      this.onProceedClickEmit.emit();
    } else {
      const keys = Object.keys(values)
      keys.forEach(val => {
        const ctrl = this.addressForm.controls[val];
        if (!ctrl.valid) {
          ctrl.markAsTouched();
        };
      });
      this.httpInterceptor.loading.next({
        loading: false,
        hasError: true,
        hasMsg: `Please enter required information.`,
        reset: 4500
      });
    }
  }

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.unsubscribe();
  }
}
