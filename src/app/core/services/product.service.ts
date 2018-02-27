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
  getProducts(params: any, options: any): any {
    let url = [];
    if(options && options.limit) {
      url.push(`limit=${options.limit}`);
    } else {
      url.push(`limit=${environment.ITEMS_PER_PAGE}`);
    }
    if(options.offset)
      url.push(`offset=${options.offset}`);
    if(options.sortBy)
      url.push(`sortBy=${options.sortBy}`);
    if(options.sortOrder)
      url.push(`sort=${options.sortOrder}`);

    switch(params.mode) {
      case 'search':
        url.push(`keyword=${params.keyword}`)
        break;
      case 'category':
        url.push(`category${params.level}=${params.categoryId}`)
        break;
    }
    const urlString = "v1/item?" + url.join('&');
    console.log("URL "+ urlString);
    return this.http.get(urlString)
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
