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
  bItemsAdded: boolean;

  constructor(
    private adminService: AdminService,
    private router: Router,
  ) { }

  ngOnInit() {
    //NOTE: dummy ID
    this.reader = new FileReader();
    this.csvData = [];
    this.bHasFile = true;
    this.bItemsAdded = true;

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
      this.bHasFile = false;
      this.csvData = newCsv.slice(0, -1);
      newCsv = [];
      for( i = 0; i < this.csvData.length; i++){
        dArr = this.csvData[i].split(',');
        newCsv.push({
          code: dArr[1].replace(/'/g,""),
          name: dArr[2].replace(/'/g,""),
          brandName: dArr[3].replace(/'/g,""),
          price: Number(dArr[4]),
          category1: dArr[5].replace(/'/g,""),
          category2: dArr[6].replace(/'/g,""),
          category3: dArr[7].replace(/'/g,""),
          dateCreated: dateCreated,
          dateUpdated: dateCreated
        });
      }
      var Obj = {...newCsv};
      this.addItems(Obj);

    };
    this.reader.readAsText(input.files[0]);
    this.setLoader();
  }

  setLoader(){
    this.bItemsAdded = false;
    this.timer = Observable.timer(3000); // 5000 millisecond means 5 seconds
    this.subs = this.timer.subscribe(() => {
        // set showloader to false to hide loading div from view after 5 seconds
        // this.router.navigate(['/admin/pbu']);
    });
  }

  addItems(data){
    this.adminService.addItems(data).subscribe();
  }


  enableAddBtn(csvInput: any){
    const input = csvInput;
    if(input){
      this.bHasFile = false;
    } else {
      this.bHasFile = true;
    }

  }


  ngOnDestroy() {
    this.reader = new FileReader();
    // localStorage.removeItem('order');
  }

}
