import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { AppState } from './../../../interfaces';
import { AddressService } from './../services/address.service';
import { getShipAddress, getBillAddress } from './../../reducers/selectors';
import { CheckoutActions } from './../../actions/checkout.actions';
import { getAuthStatus } from './../../../auth/reducers/selectors';
import { AuthActions } from './../../../auth/actions/auth.actions';
import { CheckoutService } from './../../../core/services/checkout.service';
import { UserService } from './../../../user/services/user.service';


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

  prefix: any[] = ['+63'];
  _selectedVal: any[] = ['+63'];
  shipAddressDB: any;
  billAddressDB: any;
  billAddrStore: any;
  userId: number;
  private componentDestroyed: Subject<any> = new Subject();
  private fieldLabels = {
    firstname: 'First Name',
    lastname: 'Last Name',
    email: 'Email',
    phone: 'Mobile Number',
    shippingAddress01: 'Address 1',
    city: 'City/Municipality',
    postalcode: 'Zip Code',
    country: 'Country',
    billingAddress01: 'Address 1 (billing)',
    billCity: 'City/Municipality (billing)',
    billPostalcode: 'Zip Code (billing)',
    billCountry: 'Country (billing)',
  };

  constructor(
    private fb: FormBuilder,
    private authActions: AuthActions,
    private checkoutActions: CheckoutActions,
    private checkoutService: CheckoutService,
    private addrService: AddressService,
    private userService: UserService,
    private store: Store<AppState>
  ) {
    let userData = JSON.parse(localStorage.getItem('user'));
    this.userId = userData.id;

    this.store.select(getAuthStatus).takeUntil(this.componentDestroyed).subscribe(auth => {
      this.isAuthenticated = auth;
      this.addressForm = addrService.initAddressForm(auth);
    });

    combineLatest(
      [this.store.select(getShipAddress),
      this.store.select(getBillAddress),
      this.userService.getAddress(this.userId)]
    ).subscribe((results) => {
        let storeShipAddr, storeBillAddr, dbAddr;
        [storeShipAddr, storeBillAddr, dbAddr] = results;

        if(dbAddr.length == 1) {
          this.shipAddressDB = dbAddr[0];
        } else if (dbAddr.length == 2) {
          if(dbAddr[0].default) {
            [this.shipAddressDB, this.billAddressDB] = dbAddr;
          } else {
            [this.billAddressDB, this.shipAddressDB] = dbAddr;
          }
        }

        if(storeShipAddr && storeShipAddr.shippingAddress01 && storeShipAddr.userAccountId == this.userId) {
          this.addressForm.patchValue(storeShipAddr);
          if(storeShipAddr.phone) {
            const mobileNumber = storeShipAddr.phone.split(" ");
            this.addressForm.patchValue({'prefix': mobileNumber[0], 'phone': mobileNumber[1]});
          }
        } else if (this.shipAddressDB){
          this.addressForm.patchValue({
            shippingAddress01: this.shipAddressDB.address01,
            shippingAddress02: this.shipAddressDB.address02,
            city: this.shipAddressDB.city,
            postalcode: this.shipAddressDB.postalCode,
            country: this.shipAddressDB.country
          });
        }

        if(storeBillAddr && storeBillAddr.billingAddress01 && storeShipAddr.userAccountId == this.userId) {
          this.addressForm.patchValue({'isBilling': true})
          this.addressForm.patchValue(storeBillAddr);
          this.checkBilling = true;
          this.billAddrStore = storeBillAddr;
        }
      });
    // this.store.select(getAuthStatus).takeUntil(this.componentDestroyed).subscribe(auth => {
    //   this.isAuthenticated = auth;
    //   this.addressForm = addrService.initAddressForm(auth);
    // });
    // this.store.select(getShipAddress).takeUntil(this.componentDestroyed).subscribe(data => {
    //   if(data) {
    //     this.addressForm.patchValue(data);
    //     if(data.phone) {
    //       const mobileNumber = data.phone.split(" ");
    //       this.addressForm.patchValue({'prefix': mobileNumber[0], 'phone': mobileNumber[1]});
    //     }
    //   }
    // });
    // this.store.select(getBillAddress).takeUntil(this.componentDestroyed).subscribe(data => {
    //   if(data && data.billingAddress01) {
    //     this.addressForm.patchValue({'isBilling': true})
    //     this.addressForm.patchValue(data);
    //   }
    // });

    // this.checkoutService.getAddress(this.userId).subscribe(dbAddr => {
    //   if(dbAddr.length == 1) {
    //     this.shipAddressDB = dbAddr[0];
    //   } else if (dbAddr.length == 2) {
    //     if(dbAddr[0].default) {
    //       [this.shipAddressDB, this.billAddressDB] = dbAddr;
    //     } else {
    //       [this.billAddressDB, this.shipAddressDB] = dbAddr;
    //     }
    //   }
    //   console.log(this.shipAddressDB)
    //   console.log(this.billAddressDB)
    // })
  }

  ngOnInit() {

  }

  onSubmit() {
    let errorDetails = '';
    let values = this.addressForm.value;
    let addressFields = ['firstname','lastname','email','phone','shippingAddress01','city','postalcode','country','prefix'];
    let requiredFields = !values.isBilling ? addressFields: addressFields.concat(['billingAddress01','billCity','billPostalcode','billCountry'])
    let hasError = false;

    requiredFields.forEach(val => {
      const ctrl = this.addressForm.controls[val];
      if (!ctrl.valid) {
        ctrl.markAsTouched();
        hasError = true;
        errorDetails += `\n\u2022 ${this.fieldLabels[val]}`
      };
      // console.log(requiredFields[val] + " " +this.addressForm.controls[requiredFields[val]].errors?.required);
      // console.log(val +" "+ this.addressForm.hasError('required', [val]))
    });

    if(!hasError) {
      values.phone = this._selectedVal +" "+ values.phone;
      this.saveAddress(values);
      delete values.isBilling;
      delete values.prefix;
      values.status = 'address';
      this.checkoutService.updateOrder(values).subscribe();
      this.onProceedClickEmit.emit();
    } else {
      this.checkoutService.showErrorMsg('address', errorDetails);
    }
  }

  showBillingAddr(): void {
    this.checkBilling = !this.checkBilling;
    if (this.checkBilling) {
      if (this.billAddrStore) {
        this.addressForm.patchValue(this.billAddrStore)
      } else if (this.billAddressDB) {
        this.addressForm.patchValue({
          billingAddress01: this.billAddressDB.address01,
          billingAddress02: this.billAddressDB.address02,
          billCity: this.billAddressDB.city,
          billPostalcode: this.billAddressDB.postalCode,
          billCountry: this.billAddressDB.country,
        });
      }
    } else {
      this.addressForm.patchValue({
        billingAddress01: '',
        billingAddress02: '',
        billCity: '',
        billPostalcode: '',
        billCountry: '',
      });
    }
  }

  saveAddress(values: any): void {
    let apiCalls = [];
    let shipAddrData = {
      address01: values.shippingAddress01,
      address02: values.shippingAddress02,
      city: values.city,
      country: values.country,
      postalCode: values.postalcode,
      default: true,
      billing: false,
      useraccount_id: this.userId.toString()
    }
    if(this.shipAddressDB) {
      shipAddrData['id'] = this.shipAddressDB.id;
      apiCalls.push(this.userService.updateAddress(shipAddrData));
    } else {
      apiCalls.push(this.userService.saveAddress(shipAddrData));
    }

    if(values.isBilling) {
      let billAddrData = {
        address01: values.billingAddress01,
        address02: values.billingAddress02,
        city: values.billCity,
        country: values.billCountry,
        postalCode: values.billPostalcode,
        default: false,
        billing: true,
        useraccount_id: this.userId.toString()
      }
      if(this.billAddressDB) {
        billAddrData['id'] = this.billAddressDB.id;
        apiCalls.push(this.userService.updateAddress(billAddrData));
      } else {
        apiCalls.push(this.userService.saveAddress(billAddrData));
      }
    }

    for(let i = 0, l = apiCalls.length; i < l; i++) {
      setTimeout(() => {
        apiCalls[i].subscribe();
      }, (i * 100))
    }
  }

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.unsubscribe();
  }
}
