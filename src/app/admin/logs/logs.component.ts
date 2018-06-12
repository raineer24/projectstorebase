import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AdminService } from './../services/admin.service';
import * as _ from "lodash";

@Component({
  selector: 'app-admin-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  // array of all items to be paged
  private allItems: any[];
  logs: any;
  logsSub: Subscription;
  logSub: Subscription;
  logItem$: Subscription;
  logsIndex$: any;
  logItems: any;
  logList: any;
  logsShow: any;
  users: any;
  usersSub: Subscription;
  userContainer: string[] = [];
  actionContainer: string[] = [];
  selectedA: string;
  selectedU: string;
  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit() {
    //NOTE: dummy ID
    const sellerId = 0;
    this.logsShow = [];
    this.allItems = [];

    this.userContainer = [];
    this.actionContainer = [];
    this.selectedA = this.selectedU = "All";
    this.logsSub = this.adminService.getLogs().subscribe(logs => {
      this.logs = logs;
      this.userContainer = [];
      this.actionContainer = []
      this.getAllSellerUsers(this.logs);
      // if(this.userContainer){
      //   for(const key in this.logs){
      //     if(this.userContainer.length === 0){
      //       this.userContainer.push(this.logs[key].name);
      //       console.log(this.userContainer);
      //     } else {
      //       if(!this.userContainer.includes(this.logs[key].name)){
      //         this.userContainer.push(this.logs[key].name);
      //         console.log(this.userContainer);
      //       }
      //     }
      //   }
      // }
      const jsonData = JSON.stringify(this.logs);
      localStorage.setItem('logs',jsonData);

    });
  }

  setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        this.pager = this.getPager(this.logsShow.length, page);
        this.pagedItems = this.logsShow.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 30) {
        // calculate total pages
        let totalPages = Math.ceil(totalItems / pageSize);

        let startPage: number, endPage: number;

        if (totalPages <= 5) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            } else if (currentPage + 1 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage+2;
            }
        }

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        let pages = _.range(startPage, endPage + 1);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

  getAllSellerUsers(logs: any){
    this.usersSub = this.adminService.getUsers().subscribe(user => {
      this.users = user;
      this.userContainer = [];
      for(const key in logs){
        let id = logs[key].selleraccount_id;
        let name = "";
        if(id > 0){
          name = this.getUsername(id);
        }
        this.logsShow.push({
          id: logs[key].id,
          action: logs[key].action,
          message: logs[key].message,
          user: name,
          datecreated: logs[key].dateCreated
        });
        if(this.userContainer.length == 0){
          this.userContainer.push(name);
          this.actionContainer.push(logs[key].action)
        } else {
          if(!this.userContainer.includes(name)){
            this.userContainer.push(name);
          } if(!this.actionContainer.includes(logs[key].action)){
            this.actionContainer.push(logs[key].action);
          }
        }
      }
      this.setPage(1);
      const jsonData = JSON.stringify(this.logsShow);
      localStorage.setItem('logs',jsonData);
    })
  }

  getUsername(id: number): string {
    let name = "";
    for(const key in this.users){
      if(this.users[key].id === id){
        name = this.users[key].name;
      }
    }
    return name;
  }

  filterUsers(user: string){
    var i = 0;
    var filteredLogs = [];
    this.selectedU = user;
    if(this.selectedU !== 'All') {
      for(i=0; i < this.logsShow.length; i++){
        if(this.logsShow[i].user === user){
          filteredLogs.push(this.logsShow[i]);
        }
      }
      this.logsShow = filteredLogs;
    } else {
      this.logsShow = JSON.parse(localStorage.getItem('logs'));
    }

  }

  filterActions(action: string){
    var i = 0;
    this.selectedA = action;
    var filteredLogs = [];
    this.logsShow = JSON.parse(localStorage.getItem('logs'));
    if(action !== 'All') {
      for(i=0; i < this.logsShow.length; i++){
        if(this.logsShow[i].action === action){
          filteredLogs.push(this.logsShow[i]);
        }
      }
      this.logsShow = filteredLogs;
    }
    else {
      this.logsShow = JSON.parse(localStorage.getItem('logs'));
    }

  }

  ngOnDestroy() {
    this.logsSub.unsubscribe();
    // localStorage.removeItem('order');
  }

}
