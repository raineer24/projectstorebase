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
  activeUser: any;
  operation: string;
  rolesList: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
  ) { }

  ngOnInit() {
    this.activeUser = JSON.parse(localStorage.getItem('selleruser'));
    this.initForm();
    this.routeSubscription$ = this.route.params.subscribe((params: any) => {
      this.adminService.getRolesList().subscribe((roleList) => {
        switch (this.activeUser.role_id) {
          case 1: // EOS Developer
            this.rolesList = roleList;
            break;
          case 2: // EOS Admin
            this.rolesList = [roleList[1]];
            break;
          case 3: // Partner Seller Admin
            this.rolesList = roleList.filter(role => role.name.indexOf('Partner Seller') >= 0);
            break;
          case 7: // Partner Buyer Admin
            this.rolesList = roleList.filter(role => role.name.indexOf('Partner Buyer') >= 0)
            break;
        }

        if (params.id) {
          this.operation = 'Edit';
          this.adminService.getUser(params.id).subscribe(userData => {
            console.log(userData);
            if (userData.message.toUpperCase() == 'FOUND') {
              this.userData = userData;
              this.addEditUserForm.patchValue({
                name: userData.name,
                email: userData.email,
                role: userData.role_id,
              });
              this.addEditUserForm.controls.username.reset({ value: this.userData.username, disabled: true })
            }
          });
        } else {
          this.operation = 'Add';
          this.addEditUserForm.patchValue({
            role: 0,
          });
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
      role: ['', Validators.compose([Validators.required, Validators.min(1)])],
    });
  }

  onSubmit(option?: string): void {
    const values = this.addEditUserForm.value;

    if (this.addEditUserForm.valid) {
      if (this.operation == 'Add') {
        const data = {
          username: values.username,
          email: values.email,
          name: values.name,
          role_id: Number(values.role),
        }
        this.adminService.addUser(data).subscribe(response => {
          if (response.message == 'Saved') {
            if (option === 'Add1') {
              setTimeout(() => {
                this.router.navigate(['/admin/users/edit/', response.id]);
              }, 2000);
            } else {
              this.initForm();
            }
          }
        });
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
