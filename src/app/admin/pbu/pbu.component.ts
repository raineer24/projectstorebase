import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AdminService } from './../services/admin.service';

@Component({
  selector: 'app-admin-pbu',
  templateUrl: './pbu.component.html',
  styleUrls: ['./pbu.component.scss']
})
export class PbuComponent implements OnInit {
  pbusers: any;
  pbuSub: Subscription;
  orderItem$: Subscription;
  orderIndex$: any;
  orderItems: any;
  itemList: any;
  pbuShow: any;
  statusContainer: string[] = [];
  selected: string = "All";
  storePBU: any;

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit() {
    //NOTE: dummy ID
    const pbAcct = 1;
    this.pbuSub = this.adminService.getPBUsers(pbAcct).subscribe(pbu => {
        this.pbuShow = pbu;
        console.log(this.pbuShow);
    });
  }

  isEnabled(id: number): boolean{
    for(const key in this.pbuShow){
      if(this.pbuShow[key].id === id){
        if(this.pbuShow[key].status === "enabled"){
          return true;
        } else {
          return false;
        }
      }
    }
  }

  filterStatus(status){

  }

  getOrder(index){

  }

  disablePBU(id: number){
    this.storePBU = {
      status: 'disabled'
    };
    this.pbuSub = this.adminService.updatePBU(id,this.storePBU).subscribe();
    this.ngOnInit();
  }

  enablePBU(id: number){
    this.storePBU = {
      status: 'enabled'
    };
    this.pbuSub = this.adminService.updatePBU(id,this.storePBU).subscribe();
    this.ngOnInit();
  }

  getPbu(id: number){
      let pbuContainer = [];
      for(const key in this.pbuShow){
        if(this.pbuShow[key].id === id){
            localStorage.setItem('pbuser',JSON.stringify(this.pbuShow[key]));
            return;
        }
      }

  }

  ngOnDestroy() {

  }

}
