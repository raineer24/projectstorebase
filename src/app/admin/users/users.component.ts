import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AdminService } from './../services/admin.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: any;
  activeUser: any;
  queue: Array<any> = [];
  usersSub: Subscription;
  userCountSub: Subscription;
  currentPage: number = 1;
  itemsPerPage: number = 15;
  totalItems: number;
  numPages: number;

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.activeUser = JSON.parse(localStorage.getItem('selleruser'));
    const options = {
      partnersId: this.activeUser.partner_id,
      limit: this.itemsPerPage,
    }
    this.usersSub = this.adminService.getUsers({
      partnersId: this.activeUser.partner_id,
      limit: this.itemsPerPage,
    }).subscribe(users => {
      this.users = users;
    });
    this.userCountSub = this.adminService.getUsers({
      partnersId: this.activeUser.partner_id,
      count: 1,
    }).subscribe(result => {
      if (result.length) {
        this.totalItems = result[0].count;
      }
    });
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
    this.userCountSub.unsubscribe();
  }

  setUserStatus(user: any): void {
    const data = {
      id: user.id.toString(),
      enabled: !user.enabled,
    }
    this.adminService.updateUser(data).subscribe(res => {
      if(res.message.toUpperCase() == 'UPDATED') {
        user.enabled = !user.enabled;
      }
    })
  }

  resetPassword(user: any): void {
    this.adminService.resetPassword(user.email).subscribe();
  }

  pageChanged(event: any): void {
    this.usersSub = this.adminService.getUsers({
      partnersId: this.activeUser.partner_id,
      limit: this.itemsPerPage,
      skip: (event.page - 1) * this.itemsPerPage,
    }).subscribe(users => {
      this.users = users;
    });
  }

  queueUser(user: any): void {
    console.log(user);
  }

}
