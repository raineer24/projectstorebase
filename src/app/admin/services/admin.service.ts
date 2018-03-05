import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../../core/services/http';
import { AppState } from '../../interfaces';



@Injectable()
export class AdminService {

  constructor(
    private http: HttpService,
    private store: Store<AppState>
  ) { }

  /**
   *
   *
   * @returns {Observable<Order[]>}
   *
   * @memberof AdminService
   */
  getSellerOrders(id: number): Observable<any> {
    return this.http.get(`v1/seller/account/order/${id}`)
      .map((res: Response) => res.json())
      .catch(res => Observable.empty());
  }

}
