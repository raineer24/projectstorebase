import { Component, Directive, Input, Attribute } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NG_VALIDATORS, Validator } from '@angular/forms';




@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.scss']
})
export class ResetPassComponent {
  omgForm: FormGroup
  formSubmit = false;

  constructor(private frmBuilder: FormBuilder) {

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
    this.formSubmit = true;
    console.log(values);
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
 
}

