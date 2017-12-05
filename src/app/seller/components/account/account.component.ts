import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
	isEditMode: boolean;
  constructor() { }

  ngOnInit() {
  	 this.isEditMode = false;
  }

   toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

}
