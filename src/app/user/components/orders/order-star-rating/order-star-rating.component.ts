import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
// import { HttpService } from '../../../core/services/http';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-order-star-rating',
  templateUrl: './order-star-rating.component.html',
  styleUrls: ['./order-star-rating.component.scss'],
  providers: [UserService]
})

export class OrderStarRatingComponent implements OnInit, OnDestroy {
  bClose: boolean = false;
  userFeedback: string;
  userRating: Subscription;
  @Input() closeRating: boolean = false;

  rating: {
    'useraccount_id': number,
    'orderkey': string,
    'starCount': number,
    'feedback': string,
    'feedbacktype':number
  };

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.bClose = false;
    let user = JSON.parse(localStorage.getItem('user'));
    if(user){
      // this.bClose = false;
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
    let oKey = localStorage.getItem('currentOrderKey');
    this.rating['orderkey'] = oKey;
    this.rating['starCount'] = Number(value);
    this.rating['feedbacktype'] = 1;
    // this.saveRating(this.rating);
  }

  sendFeedBack(value){
    this.bClose = true;
    this.rating['feedback'] = value;
    this.saveRating(this.rating);
  }

//save the rating to db
  saveRating(rating){
    this.userService.createStarRating(rating).subscribe(rating => {
        this.userService.showThankyou();
        // this.close();

    });
    localStorage.removeItem('currentOrderKey');
  }

  close(){
    this.bClose =  true;
  }

  ngOnDestroy() {
    // this.notiSubs.unsubscribe();
  }

}
