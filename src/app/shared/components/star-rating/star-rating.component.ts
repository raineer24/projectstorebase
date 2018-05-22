import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { HttpService } from '../../../core/services/http';
import { SharedService } from './../services/shared.service';


@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  providers: [SharedService]
})

export class StarRatingComponent implements OnInit, OnDestroy {
  @Input() closeStarRating: boolean = false;
  @Output() sendClose: EventEmitter<any> = new EventEmitter();
  bClose: boolean = false;
  userFeedback: string;
  userRating: Subscription;

  rating: {
    'useraccount_id': number;
    'orderkey': string,
    'starCount': number,
    'feedback': string
  };

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.bClose = true;
    let user = JSON.parse(localStorage.getItem('user'));
    this.userFeedback = "";
    this.userRating = new Subscription();
    if(user){
      this.rating = {
      'useraccount_id': Number(user.id),
      'orderkey': '',
      'starCount': 0,
      'feedback': ''
      };
    }
  }

//get the value of the rating and the user's feedback
  getRating(value){
    let order = JSON.parse(localStorage.getItem('order'));
    this.rating['orderkey'] = order.order_token;
    this.rating['starCount'] = Number(value);
    this.rating['feedback'] = this.userFeedback;
    // this.saveRating(this.rating);
  }

  sendFeedBack(){
    this.saveRating(this.rating);
  }

//save the rating to db
  saveRating(rating){
    this.sharedService.createStarRating(rating).subscribe(rating => {
        console.log(rating.message)
        this.sharedService.showThankyou();
        this.close();
    });
  }

  close(): boolean{
    this.bClose = true;
    this.closeStarRating = this.bClose;
    this.sendClose.emit(this.closeStarRating);
    console.log(this.closeStarRating);
    return this.bClose;
  }

  ngOnDestroy() {
    // this.notiSubs.unsubscribe();
  }

}
