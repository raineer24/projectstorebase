import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
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
    'id': string,
    'email': string,
    'lastName': string,
    'firstName': string,
    'gender': string,
    'mobileNumber': string
  };

  constructor(
    private store: Store<AppState>,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.userData = JSON.parse(localStorage.getItem('user'));
    if(typeof(this.userData.email) == 'undefined' && typeof(this.userData.id) != 'undefined') {
      this.authService.view(this.userData.id).subscribe(data => {
        const error = data.error;
        if (error) {

        } else {
          this.userData = data;
          console.log("USER DATA LOADED!");
        }
      });
    }
  }

  onUpdateClick() {
    this.onUpdateClickEmit.emit();
  }

  ngOnDestroy() {
    if (this.profileViewSubs) { this.profileViewSubs.unsubscribe() }
  }

}
