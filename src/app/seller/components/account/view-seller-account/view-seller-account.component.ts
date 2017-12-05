import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-view-seller-account',
  templateUrl: './view-seller-account.component.html',
  styleUrls: ['./view-seller-account.component.scss']
})
export class ViewSellerAccountComponent implements OnInit {
@Output() onUpdateClickEmit: EventEmitter<string> = new EventEmitter();
  sellerViewSubs: Subscription;
  userData: {
    'email': string,
    'lastName': string,
    'firstName': string,
    'gender': string,
    'mobileNumber': string
  };
  constructor() { }

 ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.userData = JSON.parse(localStorage.getItem('user'));
  }

  onUpdateClick() {
    this.onUpdateClickEmit.emit();
  }

  ngOnDestroy() {
    if (this.sellerViewSubs) { this.sellerViewSubs.unsubscribe() }
  }

}
