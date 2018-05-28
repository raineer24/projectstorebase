import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-order-list-item',
  templateUrl: './order-list-item.component.html',
  styleUrls: ['./order-list-item.component.scss']
})
export class OrderListItemComponent implements OnInit {
  @Input() order: any;
  @Input() tSlot: any;
  showFeedBackTemplate: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  getProductImageUrl(url) {
    return environment.API_ENDPOINT + url;
  }

  createFeedBack(){
    this.showFeedBackTemplate = true;
    console.log(this.showFeedBackTemplate);
  }

  close(event){
    this.showFeedBackTemplate = false;
    console.log(this.showFeedBackTemplate);
  }


}
