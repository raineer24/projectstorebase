import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
// import { AuthService } from '../../../../core/services/auth.service';
import { Store } from '@ngrx/store';
// import { AppState } from '../../../../../../interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-pbu-add',
  templateUrl: './pbu-add.component.html',
  styleUrls: ['./pbu-add.component.scss']
})
export class PbuAddComponent implements OnInit, OnDestroy {
  // @Output() onCancelClickEmit: EventEmitter<string> = new EventEmitter();
  reader: any;
  csvInput: any;
  csvData: any;
  toSQL: any;
  pbu$: Subscription;

  constructor(
    // private store: Store<AppState>,
    private adminService: AdminService,
    // private authService : AuthService
  ) { }


  ngOnInit() {
    this.reader = new FileReader();
    this.csvData = [];
  }


  onCancelClick() {
    history.back();
  }

  convertFile(csvInput: any){
    const input = csvInput;
    var newCsv = [];
    var i;
    var txt;
    this.reader.onload = () => {
      let text = this.reader.result;
      let arr = text.split('\n');
      arr.forEach(function(item, i) {
        if(i !== 0) newCsv.push(item);
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
          balance: Number(dArr[4]),
          status: dArr[5].replace(/'/g,""),
          useraccount_id: Number(dArr[6]),
          partnerBuyer_id: Number(dArr[7])
        });
      }
      var Obj = {...newCsv};
      this.createPBUsers(Obj,newCsv.length);

    };
    this.reader.readAsText(input.files[0]);
  }

  createPBUsers(data, length){
    for(let ctr = 0; ctr < length; ctr++){
      console.log(data[ctr]);
      setTimeout(() => {this.adminService.createPBU(data[ctr]).subscribe();
      }, 300);
    }
  }

  ngOnDestroy() {
  }

}
