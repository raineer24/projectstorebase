import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { AdminService } from './../../../services/admin.service';

@Component({
  selector: 'app-add-edit-users',
  templateUrl: './add-edit-users.component.html',
  styleUrls: ['./add-edit-users.component.scss']
})
export class AddEditUsersComponent implements OnInit {
  routeSubscription$: Subscription;
  addEditUserForm: FormGroup;
  userData: any = null;
  operation: string;
  rolesList: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private adminService: AdminService,
  ) { }

  ngOnInit() {
    this.initForm();
    this.routeSubscription$ = this.route.params.subscribe((params: any) => {
      this.adminService.getRolesList().subscribe((roleList) => {
        this.rolesList = roleList;
        if (params.id) {
          this.operation = 'Edit';
          this.adminService.getUser(params.id).subscribe(userData => {
            if (userData.message.toUpperCase() == 'FOUND') {
              this.userData = userData;
              this.addEditUserForm.patchValue({
                username: this.userData.username,
                name: this.userData.name,
                email: this.userData.email,
                role: this.userData.role_id,
              });
            }
          });
        } else {
          this.operation = 'Add';
        }
      });
    });
  }

  ngOnDestroy() {
    this.routeSubscription$.unsubscribe();
  }

  initForm(): void {
    this.addEditUserForm = this.fb.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      role: ['', Validators.required],
    });
  }

  onSubmit(): void {
    const values = this.addEditUserForm.value;

    if (this.addEditUserForm.valid) {
      if (this.operation == 'Add') {
        const data = {
          username: values.username,
          email: values.email,
          name: values.name,
          role_id: Number(values.role),
        }
        this.adminService.addUser(data).subscribe();
      } else {
        const data = {
          id: this.userData.id.toString(),
          email: values.email,
          name: values.name,
          role_id: Number(values.role),
        }
        this.adminService.updateUser(data).subscribe();
      }
    } else {
      const keys = Object.keys(values);
      keys.forEach(val => {
        const ctrl = this.addEditUserForm.controls[val];
        if (!ctrl.valid) {
          ctrl.markAsTouched();
        };
      });
      this.adminService.showErrorMsg('Validation Error');
    }
  }
}
