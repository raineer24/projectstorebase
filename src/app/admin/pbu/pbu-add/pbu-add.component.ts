import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
// import { AuthService } from '../../../../core/services/auth.service';
import { Store } from '@ngrx/store';
// import { AppState } from '../../../../../../interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Rx';

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
  private subs: Subscription;
  private timer: Observable<any>;
  bHasFile: boolean;
  bPBUAdded: boolean;
  bUsersCreated: boolean;
  activeUser: any;
  @Input() loader: any;

  constructor(
    // private store: Store<AppState>,
    private adminService: AdminService,
    private router: Router,
    // private authService : AuthService
  ) { }


  ngOnInit() {
    this.reader = new FileReader();
    this.csvData = [];
    this.bHasFile = true;
    this.bPBUAdded = true;
    this.bUsersCreated = false;
    this.activeUser = JSON.parse(localStorage.getItem('selleruser'));
    console.log(this.activeUser.partner_id);
  }


  onCancelClick() {
    history.back();
  }

  goBack() {
    this.router.navigate(['/admin/pbu']);
  }

  enableAddBtn(csvInput: any){
    const input = csvInput;
    if(input){
      this.bHasFile = false;
    } else {
      this.bHasFile = true;
    }

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
          firstname: dArr[2].replace(/'/g,""),
          lastname: dArr[3].replace(/'/g,""),
          credit: Number(dArr[4]),
          availablebalance: Number(dArr[5]),
          outstandingbalance: 0.00,
          status: dArr[6].replace(/'/g,""),
          // useraccount_id: Number(dArr[7]),
          partner_id: this.activeUser.partner_id,
          dateCreated: dateCreated,
          dateUpdated: dateCreated
        });
      }
      var Obj = {...newCsv};
      console.log(Obj);
      // this.createUsers(Obj);
      this.createUsers(Obj);

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

  hideLoader(){
    this.bPBUAdded = true;
  }

  createUsers(data) {
    var toUsers = [];
    var toPBU = [];
    for(const key in data){
      toUsers.push({
        user: {
          username: data[key].email,
          email: data[key].email,
          firstName: data[key].firstname,
          lastName: data[key].lastname,
          password: this.passwordGen(),
          dateCreated: data[key].dateCreated,
          dateUpdated: data[key].dateCreated
        },
        pbu:{
          username: data[key].email,
          email: data[key].email,
          name: data[key].firstname+ ' '+data[key].lastname,
          credit: data[key].credit,
          availablebalance: data[key].credit,
          status: data[key].status,
          partner_id: data[key].partner_id,
        }
      });
    }
    var usersObj = {...toUsers};
    this.adminService.createUsers(usersObj).subscribe(users => {
      if(users.message === "Saved"){
        this.setPBUData(data);
      }
    });
  }

  setPBUData(data){


  }

  createPBUsers(data){
    this.createUsers(data);
    for(const key in data){
      this.adminService.createPBU(data[key].email).subscribe();
    }
  }


  passwordGen(): string{
    var length = 4, charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()`~,./:;{}[]", retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  checkcsvInput(input): boolean {
    if(input.value != null){
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy() {
  }

}
