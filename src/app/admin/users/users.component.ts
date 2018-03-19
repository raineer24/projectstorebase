import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AdminService } from './../services/admin.service';

@Component({
  selector: 'app-orders',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: any;
  usersSub: Subscription;
  usermail: string;

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit() {
    //NOTE: dummy ID
    this.usersSub = this.adminService.getUsers().subscribe(user => {
      this.users = user
      this.usermail = this.users.username;
    })

  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
  }

}
