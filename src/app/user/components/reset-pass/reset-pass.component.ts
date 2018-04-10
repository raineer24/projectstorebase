import { Component, Directive, Input, Attribute } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NG_VALIDATORS, Validator } from '@angular/forms';
import { INVALID } from '@angular/forms/src/model';
import { AuthService } from '../../../core/services/auth.service';



@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.scss']
})
export class ResetPassComponent {
  omgForm: FormGroup
  formSubmit = false;
  model: any = {};
  loading = false;
  constructor(private frmBuilder: FormBuilder,
    private authService: AuthService) {

  }

  private pushErrorFor(ctrl_name: string, msg: string) {
    this.omgForm.controls[ctrl_name].setErrors({'msg': msg});
  }
  ngOnInit() {
    this.rForm();
    
  }

  rForm() {
    const password = '';
    const verify = '';
    this.omgForm = this.frmBuilder.group({
      'password': [password, Validators.compose([Validators.required, Validators.minLength(6)])],
      'verify': [verify, Validators.compose([Validators.required, Validators.minLength(6)])],
    }, {Validator: this.matchingPasswords('password', 'verify')});
  }
  onSubmit(){
      const values = this.omgForm.value;
    const keys = Object.keys(values);
  this.formSubmit = true;
    console.log(values);
    const data = {
        'password': 'values.password'
    };
    if(this.omgForm.valid) {
      console.log("success!");
    } else {
      keys.forEach(val => {
        const ctrl = this.omgForm.controls[val];
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
  resetPass() {
    this.loading = true;
    this.authService.create(this.model)
      .subscribe(
      data => {
        //this.alertService.success('Registration successful', true);
        console.log("registration successful");
        //this.router.navigate(['/login']);
      },
      error => {
        //this.alertService.error(error);
        //this.loading = false;
      });
  }
 
}

