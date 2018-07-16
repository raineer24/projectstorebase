import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AdminService } from '../../../services/admin.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-updateitems',
  templateUrl: './update-items.component.html',
  styleUrls: ['./update-items.component.scss']
})
export class UpdateItemsComponent implements OnInit {
  private timer: Observable<any>;
  private subs: Subscription;
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
        if (dArr[1] === 'TRUE'){
          newCsv.push({
            code: dArr[0].replace(/'/g,""),
            weighted: 1,
            dateUpdated: dateCreated
          });
        } else if(Number(dArr[1]) || Number(dArr[1]) > 0){
          newCsv.push({
            code: dArr[0].replace(/'/g,""),
            price: Number(dArr[1].replace(/'/g,"")),
            displayPrice: Number(dArr[1].replace(/'/g,"")),
            packaging: Number(dArr[1].replace(/'/g,"")),
            dateUpdated: dateCreated
          });
        } else {
          newCsv.push({
            code: dArr[0].replace(/'/g,""),
            enabled: 0,
            dateUpdated: dateCreated
          });
        }
      }
      var Obj = {...newCsv};
      this.updateItems(Obj);

    };
    this.reader.readAsText(input.files[0]);
    this.setLoader();
  }

  setLoader(){
    this.bItemsAdded = false;
    this.timer = Observable.timer(3000); // 5000 millisecond means 5 seconds
    this.subs = this.timer.subscribe(() => {
        // set showloader to false to hide loading div from view after 5 seconds
       this.router.navigate(['/admin/master-list/components/item-list']);
    });
  }

  updateItems(data){
    this.adminService.updateItems(data).subscribe();
  }


  enableUpdateBtn(csvInput: any){
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
