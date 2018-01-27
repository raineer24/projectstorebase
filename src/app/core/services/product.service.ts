import { Observable } from 'rxjs/Observable';
import { HttpService } from './http';
import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';

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
   * @param {string} keyword
   * @param {number} offset optional, default = 0
   * @param {number} limit optional, default = 5
   * @returns {Observable<any>}
   *
   * @memberof ProductService
   */
  getAutoSuggestItems(keyword: string, offset = 0, limit = 5): Observable<any> {
    return this.http.get(`v1/item?offset=${offset}&limit=${limit}&keyword=${keyword}`)
      .map(res => res.json())
      .catch(err => Observable.empty());
  }

  /**
   *
   *
   * @param {number} categoryId
   * @param {number} level
   * @param {number} offset optional, default = 0
   * @param {number} limit optional, default = 20
   * @returns {Observable<any>}
   *
   * @memberof ProductService
   */
  getItemsByCategory(categoryId: number, level: number, offset = 0, limit = environment.ITEMS_PER_PAGE): Observable<any> {
    return this.http.get(`v1/item?offset=${offset}&limit=${limit}&category${level}=${categoryId}`)
      .map(res => res.json())
      .catch(err => Observable.empty());
  }

  /**
   *
   *
   * @param {string} id
   * @returns {Observable<any>}
   *
   * @memberof ProductService
   */
  getProduct(id: string): Observable<any> {
    return this.http.get(`v1/item/${id}`)
      .map(res => res.json())
      .catch(err => Observable.empty());
  }

  /**
   *
   *
   * @param {string} id
   * @returns {Observable<any>}
   *
   * @memberof ProductService
   */
  getItem(id: string): Observable<any> {
    return this.http.get(`v1/item/${id}`)
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
  getProducts(limit = environment.ITEMS_PER_PAGE, offset = 0): any {
    return this.http.get(`v1/item?offset=${offset}&limit=${limit}`)
      .do(res => { console.log(res)})
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
    return this.http.get(`v1/category/list`)
    .map(res => res.json())
    .catch(err => Observable.empty());
  }

}
