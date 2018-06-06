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
  orderContainer: Array<any>;
  bhasStarfb: boolean = false;


  constructor(private userService: UserService) { }

  ngOnInit() {
    this.orderContainer = [];
  }

}
