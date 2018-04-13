import { Component, Directive, Input, Attribute, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NG_VALIDATORS, Validator } from '@angular/forms';
import { INVALID } from '@angular/forms/src/model';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../../interfaces';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.scss']
})
export class ResetPassComponent {
  routeSubscription$: Subscription;
  resetForm: FormGroup
  formSubmit = false;
  model: any = {};
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
  }

  ngOnInit() {
    this.routeSubscription$ = this.route.params.subscribe((params: any) => {
    });

    this.initForm();
  }

  ngOnDestroy() {
    this.routeSubscription$.unsubscribe();
  }

  initForm() {
    const password = '';
    const verify = '';
    this.resetForm = this.formBuilder.group({
      'password': [password, Validators.compose([Validators.required, Validators.minLength(6)])],
      'verify': [verify, Validators.compose([Validators.required, Validators.minLength(6)])],
    }, {Validator: this.matchingPasswords('password', 'verify')});
  }

  onSubmit(){
    const values = this.resetForm.value;
    const keys = Object.keys(values);
    this.formSubmit = true;

    const data = {
      'password': 'values.password'
    };
    if(this.resetForm.valid) {
      this.loading = true;
    } else {
      keys.forEach(val => {
        const ctrl = this.resetForm.controls[val];
        if(!ctrl.valid){
          this.pushErrorFor(val, null);
          ctrl.markAsTouched();
          this.formSubmit = false;
        }
      });
    }
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return(group: FormGroup): {[key: string]: any} => {
      const password = group.controls[passwordKey];
      const verify = group.controls[confirmPasswordKey];

      if(password.value !== verify.value) {
        return {
            mismatchedPaswords: true
        };
      }
    }
  }

  private pushErrorFor(ctrl_name: string, msg: string) {
    this.resetForm.controls[ctrl_name].setErrors({'msg': msg});
  }
}
