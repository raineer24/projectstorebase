import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit, OnDestroy {
  @Output() onUpdateClickEmit: EventEmitter<string> = new EventEmitter();
  profileViewSubs: Subscription;
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
    if (this.profileViewSubs) { this.profileViewSubs.unsubscribe() }
  }

}
