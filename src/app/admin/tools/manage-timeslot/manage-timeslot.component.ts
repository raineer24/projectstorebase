import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminService } from './../../services/admin.service';


@Component({
  selector: 'app-manage-timeslot',
  templateUrl: './manage-timeslot.component.html',
  styleUrls: ['./manage-timeslot.component.scss']
})
export class ManageTimeslotComponent implements OnInit {
  timeSlotData$: Observable<any>;
  timeSlotRows: Array<any>;
  timeSlotData: Array<any>;
  timeSlotMax: Array<any> = [[],[],[],[],[]];

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.adminService.getTimeSlot().subscribe(data => {
      data.splice(7,1);
      this.timeSlotData = data;
      this.timeSlotRows = this.timeSlotData[0].range;
      for(let i = 0, il = data.length; i < il; i++) {
        for(let j = 0, jl = data[i].range.length; j < jl; j++) {
          this.timeSlotMax[j][i] = data[i].range[j].max;
        }
      }
    });
  }

  saveTimeSlots(): void {
    // NOTE: JS day 0 = sunday
    // database d1max = monday
    let d = (new Date().getDay()) - 1, transposed;
    if (d == 0) {
      transposed = this.timeSlotMax;
    } else {
      if (d < 0) {
        d = 6;
      }
      let x = 7 - d;
      transposed = this.timeSlotMax.map(inner => {
        return inner.slice(x).concat(inner.slice(0,x));
      })
    }

    const apiData = transposed.map((inner, i) => {
      let objArr = inner.map((inner2, j) => {
        let obj = {};
        obj[`d${(j + 1)}max`] = inner2;
        return obj;
      })
      return Object.assign({ id: i + 1 }, Object.assign({}, ...objArr),)
    })
    console.log(JSON.parse(apiData));

  }

  updateValue(e, i, j): void {
    const value = Number(e.srcElement.value);
    if(isNaN(value) || !Number.isInteger(value) || value < this.timeSlotData[j].range[i].booked) {
      e.srcElement.value = this.timeSlotData[j].range[i].max;
    } else {
      e.srcElement.value = value;
      this.timeSlotMax[i][j] = value;
    }
  }

}
