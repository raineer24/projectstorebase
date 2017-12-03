import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  @Output() onCancelClickEmit: EventEmitter<string> = new EventEmitter();
  profileEditForm: FormGroup;
  profileEditSubs: Subscription;
  userData: {
    'id': Number,
    'email': string,
    'lastName': string,
    'firstName': string,
    'gender': string,
    'mobileNumber': string
  };

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private authService: AuthService
  ) { }

  private pushErrorFor(ctrl_name: string, msg: string) {
    this.profileEditForm.controls[ctrl_name].setErrors({'msg': msg});
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.profileEditForm = this.fb.group({
      'email': [this.userData.email, Validators.compose([Validators.required, Validators.email]) ],
      'lastName': [this.userData.lastName, Validators.required],
      'firstName': [this.userData.firstName, Validators.required],
      'gender': [this.userData.gender,Validators.required],
      'mobileNumber': [this.userData.mobileNumber, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10),Validators.pattern('[0-9]{10}')]) ]
    });
    // this.profileEditForm = this.fb.group({
    //   'email': [this.userData.email, Validators.compose([Validators.required, Validators.email]) ],
    //   'lastName': ["Julio", Validators.required],
    //   'firstName': ["Mark", Validators.required],
    //   'gender': ["male", Validators.required],
    //   'mobileNumber': ["1234567890", Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10),Validators.pattern('[0-9]{10}')]) ]
    // });
  }

  onCancelClick() {
    this.onCancelClickEmit.emit();
  }

  onSubmit() {
    const values = this.profileEditForm.value;
    let data = {
      'id': this.userData.id,
      'username': values.email,
      'lastName': values.lastName,
      'firstName': values.firstName,
      'gender': values.gender,
      'mobileNumber': values.mobileNumber
    }

    const keys = Object.keys(values);

    if (this.profileEditForm.valid) {
      this.profileEditSubs = this.authService.update(data).subscribe(data => {
        const error = data.error;
        if (error) {

        } else {
          console.log("UPDATED!");
        }
      });
    } else {
      keys.forEach(val => {
        const ctrl = this.profileEditForm.controls[val];
        if (!ctrl.valid) {
          this.pushErrorFor(val, null);
          ctrl.markAsTouched();
        };
      });
    }
  }

  ngOnDestroy() {
    if (this.profileEditSubs) { this.profileEditSubs.unsubscribe() }
  }
}
