import { Component, OnInit, OnDestroy } from '@angular/core';
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
  bClose: boolean;
  userRating: Subscription;
  rating: {
    'orderkey': string,
    'starCount': number
  };

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.bClose = false;
    this.userRating = new Subscription();
    this.rating = {
      'orderkey': '',
      'starCount': 0
    };
  }

//get the value of the rating
  getRating(value){
    let order = JSON.parse(localStorage.getItem('order'));
    this.rating['orderkey'] = order.order_token;
    this.rating['starCount'] = Number(value);
    console.log(JSON.stringify(this.rating));
    this.saveRating(this.rating);

  }

//save the rating to db
  saveRating(rating){
    this.sharedService.createStarRating(rating).subscribe(rating =>{});
  }

  close(){
    this.bClose = true;
  }

  ngOnDestroy() {
    // this.notiSubs.unsubscribe();
  }

}
