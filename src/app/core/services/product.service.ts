import { Observable } from 'rxjs/Observable';
import { HttpService } from './http';
import { Injectable } from '@angular/core';

@Injectable()
export class ProductService {

  /**
   * Creates an instance of ProductService.
   * @param {HttpService} http
   *
   * @memberof ProductService
   */
  constructor(private http: HttpService) { }

  /**
   *
   *
   * @param {string} id
   * @returns {Observable<any>}
   *
   * @memberof ProductService
   */
  getProduct(id: string): Observable<any> {
    return this.http.get(`/spree/api/v1/products/${id}`)
    .map(res => res.json())
    .catch(err => Observable.empty());
  }

  /**
   *
   *
   * @returns {*}
   *
   * @memberof ProductService
   */
  getTaxonomies(): any {
    return this.http.get(`/spree/api/v1/taxonomies?set=nested`)
    .map(res => res.json())
    .catch(err => Observable.empty());
  }

  /**
   *
   *
   * @returns {*}
   *
   * @memberof ProductService
   */
  getProducts(): any {
    return this.http.get(`v1/item?offset=0&limit=10`)
    .map(res => res.json())
    .catch(err => Observable.empty());
  }

  /**
   *
   *
   * @returns {*}
   *
   * @memberof ProductService
   */
  getCategories(): any {
    return this.http.get(`/v1/category/list`)
    .map(res => res.json())
    .catch(err => Observable.empty());
  }

}
