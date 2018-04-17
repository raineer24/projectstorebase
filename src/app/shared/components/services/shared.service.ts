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
   *function to save star rating to db
   *
   * @returns {Observable<Order[]>}
   *
   * @memberof SharedService
   */
  createStarRating(rating): Observable<any> {
    console.log('creating star rating');
    console.log(rating);
    return this.http.post(`v1/ratings/`,{
      orderkey: rating.orderkey,
      starCount: rating.starCount
    }).map((res: Response) => res.json())
      .catch(res => Observable.empty());
  }

  }
