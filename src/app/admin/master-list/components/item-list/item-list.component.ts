import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AdminService } from '../../../services/admin.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-itemlist',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  private timer: Observable<any>;
  private subs: Subscription;
  itemList$: Subscription;
  items: any;
  categories: any;
  itemCount: number;

  constructor(
    private adminService: AdminService,
    private router: Router,
  ) { }

  ngOnInit() {
    //NOTE: dummy ID
    this.itemCount = 0;
    this.generateItemList(this.itemCount);

  }

  generateItemList(offset: number){
    this.itemList$ = this.adminService.getItems(offset).subscribe(list => {
      this.items = list['list'];
      this.categories = list['categories'];
    });
  }

  nextItems(){
    this.itemCount = this.itemCount + 10;
    this.generateItemList(this.itemCount);
  }

  prevItems(){
    if(this.itemCount !== 0){
      this.itemCount = this.itemCount - 10;
      this.generateItemList(this.itemCount);
    }
  }

  filterStatus(status){

  }

  ngOnDestroy() {
    // localStorage.removeItem('order');
  }

}
