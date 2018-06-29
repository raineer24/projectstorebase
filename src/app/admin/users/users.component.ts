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
  itemsPerPage: number = 15;
  currentPage: number = 1;

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.activeUser = JSON.parse(localStorage.getItem('selleruser'));
    const options = {
      sellersId: this.activeUser.seller_id,
      // limit: this.itemsPerPage,
      limit: 100,
    }
    this.usersSub = this.adminService.getUsers(options).subscribe(users => {
      this.users = users;
    });
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
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

  }

  queueUser(user: any): void {
    console.log(user);
  }

}
