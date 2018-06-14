import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
// import { AuthService } from '../../../../core/services/auth.service';
import { Store } from '@ngrx/store';
// import { AppState } from '../../../../../../interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-pbu-edit',
  templateUrl: './pbu-edit.component.html',
  styleUrls: ['./pbu-edit.component.scss']
})
export class PbuEditComponent implements OnInit, OnDestroy {
  // @Output() onCancelClickEmit: EventEmitter<string> = new EventEmitter();
  profileEditForm: FormGroup;
  // profileEditSubs: Subscription;
  @Input() email: string;
  pbuData: {
    'id': Number,
    'name': string,
    'username': string,
    'email': string,
    'balance': string,
    'credit': string
  };
  storePBU$: Subscription;
  storePBU: any;

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
    this.storePBU = [];
    this.pbuData = JSON.parse(localStorage.getItem('pbuser'));
    console.log(this.pbuData);
  }

  onCancelClick() {
    history.back();
  }

  save(id: number, email: string, credit: number) {
    // console.log(id,email,Number(credit));
    this.storePBU = {
      email: email,
      credit: Number(credit)
    };

    this.storePBU$ = this.adminService.updatePBU(id,this.storePBU).subscribe();
    console.log(this.storePBU);
  }

  ngOnDestroy() {
  }

}
