import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AdminService } from '../../../services/admin.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-additems',
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.scss']
})
export class AddItemsComponent implements OnInit {
  private timer: Observable<any>;
  private subs: Subscription;
  orders: any;
  ordersSub: Subscription;
  orderSub: Subscription;
  orderItem$: Subscription;
  orderIndex$: any;
  orderItems: any;
  itemList: any;
  ordersShow: any;
  statusContainer: string[] = [];
  selected: string = "All";
  reader: any;
  csvInput: any;
  csvData: any;
  bHasFile: boolean;
  bPBUAdded: boolean;

  constructor(
    private adminService: AdminService,
    private router: Router,
  ) { }

  ngOnInit() {
    //NOTE: dummy ID
    this.reader = new FileReader();
    this.csvData = [];
    this.bHasFile = true;
    this.bPBUAdded = true;

  }

  filterStatus(status){

  }

  convertFile(csvInput: any){
    var dateCreated = Date.now();
    const input = csvInput;
    var newCsv = [];
    var i;
    var txt;
    this.reader.onload = () => {
      let text = this.reader.result;
      let arr = text.split('\n');
      arr.forEach(function(item, i) {
        if(i !== 0){
          if(!newCsv.includes(item)){
            newCsv.push(item);
          }
        }
      })
      let dArr = [];
      this.csvData = newCsv.slice(0, -1);
      newCsv = [];
      for( i = 0; i < this.csvData.length; i++){
        dArr = this.csvData[i].split(',');
        newCsv.push({
          username: dArr[0].replace(/'/g,""),
          email: dArr[1].replace(/'/g,""),
          name: dArr[2].replace(/'/g,""),
          credit: Number(dArr[3]),
          availablebalance: Number(dArr[4]),
          outstandingbalance: 0.00,
          status: dArr[5].replace(/'/g,""),
          useraccount_id: Number(dArr[6]),
          partnerBuyer_id: Number(dArr[7]),
          dateCreated: dateCreated,
          dateUpdated: dateCreated
        });
      }
      var Obj = {...newCsv};
      // this.createPBUsers(Obj,newCsv.length);

    };
    this.reader.readAsText(input.files[0]);
    this.setLoader();
  }

  setLoader(){
    this.bPBUAdded = false;
    this.timer = Observable.timer(3000); // 5000 millisecond means 5 seconds
    this.subs = this.timer.subscribe(() => {
        // set showloader to false to hide loading div from view after 5 seconds
        this.bPBUAdded = true;
        this.router.navigate(['/admin/pbu']);
    });
  }




  ngOnDestroy() {

    // localStorage.removeItem('order');
  }

}
