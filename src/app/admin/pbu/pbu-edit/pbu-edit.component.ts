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
    'availablebalance': Number,
    'outstandingbalance': Number,
    'credit': Number,
    'status': string,
    'useraccount_id': Number,
    'dateUpdated': string
  };
  storePBU$: Subscription;
  storePBU: any;
  status: any;
  pStatus: string;

  constructor(
    private fb: FormBuilder,
    // private store: Store<AppState>,
    private adminService: AdminService,
    private router: Router,
    // private authService : AuthService
  ) { }


  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.storePBU = [];
    this.pbuData = JSON.parse(localStorage.getItem('pbuser_selected'));
    this.pStatus = this.pbuData.status;
  }

  onCancelClick() {
    this.router.navigate(['/admin/pbu']);
  }

  save(id: Number, email: string, credit: string) {
    // console.log(id,email,Number(credit));
    credit = credit.replace(/,/g,"");
    if(email && credit) {
      this.storePBU = {
        email: email,
        credit: Number(credit),
        availablebalance: Number(credit) - Number(this.pbuData.outstandingbalance),
      };
    } else if(email && !credit) {
      this.storePBU = {
        email: email,
      };
    } else if(!email && credit) {
      this.storePBU = {
        credit: Number(credit),
        availablebalance: Number(credit) - Number(this.pbuData.outstandingbalance),
      };
    }

    this.storePBU$ = this.adminService.updatePBU(id,this.storePBU).subscribe();
    console.log(this.storePBU);
  }

  setStatusEnabled() {
    this.pStatus = "enabled";
  }

  setStatusDisabled() {
    this.pStatus = "disabled";
  }

  ngOnDestroy() {
    localStorage.removeItem('pbuser_selected');
  }

}
