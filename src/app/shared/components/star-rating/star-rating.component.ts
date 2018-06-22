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
    'feedback': string,
    'feedbacktype':number
  };

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.bClose = true;
    let user = JSON.parse(localStorage.getItem('user'));
    if(user){
      this.bClose = false;
      this.userFeedback = "";
      this.userRating = new Subscription();
      this.rating = {
        'useraccount_id': Number(user.id),
        'orderkey': '',
        'starCount': 0,
        'feedback': '',
        'feedbacktype': 0
      };
    }
  }

//get the value of the rating and the user's feedback
  getRating(value){
    let order_key = localStorage.getItem('rating_orderKey');
    this.rating['orderkey'] = order_key;
    this.rating['starCount'] = Number(value);
    this.rating['feedbacktype'] = 2;
  }

  sendFeedBack(value: string){
    this.bClose = true;
    this.rating['feedback'] = value;
    this.saveRating(this.rating);
  }

//save the rating to db
  saveRating(rating){
    this.sharedService.createStarRating(rating).subscribe(rating => {
      this.sharedService.showThankyou();
      localStorage.removeItem('rating_orderKey');
    });
  }

  close(){
    this.bClose = true;
  }

  ngOnDestroy() {
    // this.notiSubs.unsubscribe();
  }

}
