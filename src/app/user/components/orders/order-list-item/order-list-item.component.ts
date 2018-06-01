import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-order-list-item',
  templateUrl: './order-list-item.component.html',
  styleUrls: ['./order-list-item.component.scss']
})
export class OrderListItemComponent implements OnInit {
  @Input() order: any;
  @Input() tSlot: any;
  showFeedBackTemplate: boolean;


  constructor(private userService: UserService) { }

  ngOnInit() {
    this.showFeedBackTemplate = this.userService.switchBool;
  }

  getProductImageUrl(url) {
    return environment.API_ENDPOINT + url;
  }

  createFeedBack(event: any){
    this.showFeedBackTemplate = this.userService.switch();
  }

}
