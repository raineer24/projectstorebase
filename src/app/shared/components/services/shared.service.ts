import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../../../core/services/http';
import { AppState } from '../../../interfaces';



@Injectable()
export class SharedService {

  constructor(
    private http: HttpService,
    private store: Store<AppState>
  ) { }

  /**
   * Creates an instance of CheckoutService.
   * @param {HttpService} http
  /**
   *function to save star rating to db
   *
   * @returns {Observable<Order[]>}
   *
   * @memberof SharedService
   */
  createStarRating(rating): Observable<any> {
    return this.http.post(`v1/ratings/save`,{
      useraccount_id: rating.useraccount_id,
      orderkey: rating.orderkey,
      starCount: rating.starCount,
      feedback: rating.feedback,
      feedbacktype: rating.feedbacktype
    }).map((res: Response) => res.json())
      .catch(res => Observable.empty());
  }

  getStarRating(orderkey: string): Observable<any> {
    return this.http.get(`v1/ratings/${orderkey}`
    ).map((res: Response) => res.json())
      .catch(res => Observable.empty());
  }

  /**
   *
   *
   * @returns void
   *
   * @memberof CheckoutService
   */

  showThankyou(): void{
    this.http.loading.next({
      loading: false,
      thankYou: true,
      hasMsg: `Thank you!`,
      reset: 4500
    });
   }

}
