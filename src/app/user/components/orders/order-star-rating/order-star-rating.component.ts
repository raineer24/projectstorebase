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
    'useraccount_id': number;
    'orderkey': string,
    'starCount': number,
    'feedback': string
  };

  constructor(
    private userService: UserService
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
    this.bClose = true;
    this.saveRating(this.rating);
  }

//save the rating to db
  saveRating(rating){
    this.userService.createStarRating(rating).subscribe(rating => {
        this.userService.showThankyou();
        // this.close();

    });
  }

  close(){
    this.bClose =  true;
  }

  ngOnDestroy() {
    // this.notiSubs.unsubscribe();
  }

}
