import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { AdminService } from './../../../services/admin.service';

@Component({
  selector: 'app-add-edit-users',
  templateUrl: './add-edit-users.component.html',
  styleUrls: ['./add-edit-users.component.scss']
})
export class AddEditUsersComponent implements OnInit {
  addEditUserForm: FormGroup;
  userId: number;
  operation: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private adminService: AdminService,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.addEditUserForm = this.fb.group({
      username: ['', Validators.required],
      name: '',
      email: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

}
