import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
// import { AuthService } from '../../../../core/services/auth.service';
import { Store } from '@ngrx/store';
// import { AppState } from '../../../../../../interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-user-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss']
})
export class UsersEditComponent implements OnInit, OnDestroy {
  // @Output() onCancelClickEmit: EventEmitter<string> = new EventEmitter();
  // profileEditForm: FormGroup;
  // profileEditSubs: Subscription;
  @Input() email: string;
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
    // private store: Store<AppState>,
    private adminService: AdminService,
    // private authService : AuthService
  ) { }


  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.userData = JSON.parse(localStorage.getItem('user'));
    console.log(this.userData);
    if(typeof(this.userData.email) == 'undefined' && typeof(this.userData.id) != 'undefined') {
      this.adminService.view(this.userData.id).subscribe(data => {
        const error = data.error;
        if (error) {

        } else {
          this.userData = data;
          console.log("USER DATA LOADED!");
        }
      });
    }
  }

  onCancelClick() {
    history.back();
  }

  onSubmit() {

    }



    // if (this.profileEditForm.valid) {
    //   this.profileEditSubs = this.adminService.update(this.userData.id, data).subscribe(res => {
    //     if (res.message == 'Updated') {
    //     }
    //   });
    // } else {
    //   keys.forEach(val => {
    //     const ctrl = this.profileEditForm.controls[val];
    //     console.log(ctrl
    //     )
    //     if (!ctrl.valid) {
    //       this.pushErrorFor(val, null);
    //       ctrl.markAsTouched();
    //     };
    //   });
    // }

  ngOnDestroy() {
     }

}
