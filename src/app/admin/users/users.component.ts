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
  queue: Array<any> = [];
  usersSub: Subscription;

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit() {
    //NOTE: dummy ID
    this.usersSub = this.adminService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
  }

  setUserStatus(user: any): void {
    const data = {
      id: user.id,
      enabled: !user.enabled.data[0] ? 1: 0,
    }
    this.adminService.updateUser(data).subscribe(res => {
      if(res.message.toUpperCase() == 'UPDATED') {
        user.enabled.data[0] = !user.enabled.data[0] ? 1: 0
      }
    })
  }

  resetPassword(user: any): void {

  }

  queueUser(user: any): void {
    console.log(user);
  }

}
