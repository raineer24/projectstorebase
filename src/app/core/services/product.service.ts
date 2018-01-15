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
   * @param {number} limit optional, default = 10
   * @returns {Observable<any>}
   *
   * @memberof ProductService
   */
  getItemsByCategory(categoryId: number, level: number, offset = 0, limit = 10): Observable<any> {
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
  getProducts(): any {
    return this.http.get(`v1/item?offset=0&limit=50`)
      .do(res => { console.log(res)})
      .map(res => res.json())
      .catch(err => Observable.empty());
    // const data =
    // {
    //   "list":
    //   [{
    //   "id": 447,
    //   "name": "Clothing",
    //   "brandName": "Baby",
    //   "price": 670,
    //   "displayPrice": 741
    // }, {
    //   "id": 844,
    //   "name": "Baby",
    //   "brandName": "Electronics",
    //   "price": 53,
    //   "displayPrice": 758
    // }, {
    //   "id": 491,
    //   "name": "Electronics",
    //   "brandName": "Kids",
    //   "price": 861,
    //   "displayPrice": 631
    // }, {
    //   "id": 204,
    //   "name": "Music",
    //   "brandName": "Home",
    //   "price": 380,
    //   "displayPrice": 256
    // }, {
    //   "id": 460,
    //   "name": "Toys",
    //   "brandName": "Toys",
    //   "price": 317,
    //   "displayPrice": 711
    // }, {
    //   "id": 681,
    //   "name": "Music",
    //   "brandName": "Automotive",
    //   "price": 15,
    //   "displayPrice": 838
    // }, {
    //   "id": 469,
    //   "name": "Home",
    //   "brandName": "Sports",
    //   "price": 739,
    //   "displayPrice": 665
    // }, {
    //   "id": 268,
    //   "name": "Toys",
    //   "brandName": "Movies",
    //   "price": 89,
    //   "displayPrice": 624
    // }, {
    //   "id": 940,
    //   "name": "Jewelery",
    //   "brandName": "Jewelery",
    //   "price": 757,
    //   "displayPrice": 829
    // }, {
    //   "id": 223,
    //   "name": "Sports",
    //   "brandName": "Jewelery",
    //   "price": 957,
    //   "displayPrice": 99
    // }, {
    //   "id": 566,
    //   "name": "Movies",
    //   "brandName": "Health",
    //   "price": 353,
    //   "displayPrice": 755
    // }, {
    //   "id": 60,
    //   "name": "Movies",
    //   "brandName": "Sports",
    //   "price": 226,
    //   "displayPrice": 838
    // }, {
    //   "id": 762,
    //   "name": "Baby",
    //   "brandName": "Kids",
    //   "price": 623,
    //   "displayPrice": 911
    // }, {
    //   "id": 541,
    //   "name": "Movies",
    //   "brandName": "Outdoors",
    //   "price": 242,
    //   "displayPrice": 644
    // }, {
    //   "id": 738,
    //   "name": "Movies",
    //   "brandName": "Shoes",
    //   "price": 131,
    //   "displayPrice": 748
    // }, {
    //   "id": 711,
    //   "name": "Electronics",
    //   "brandName": "Shoes",
    //   "price": 693,
    //   "displayPrice": 94
    // }, {
    //   "id": 561,
    //   "name": "Sports",
    //   "brandName": "Clothing",
    //   "price": 256,
    //   "displayPrice": 433
    // }, {
    //   "id": 559,
    //   "name": "Garden",
    //   "brandName": "Home",
    //   "price": 903,
    //   "displayPrice": 370
    // }, {
    //   "id": 508,
    //   "name": "Baby",
    //   "brandName": "Sports",
    //   "price": 671,
    //   "displayPrice": 420
    // }, {
    //   "id": 879,
    //   "name": "Books",
    //   "brandName": "Outdoors",
    //   "price": 992,
    //   "displayPrice": 811
    // }, {
    //   "id": 64,
    //   "name": "Toys",
    //   "brandName": "Industrial",
    //   "price": 73,
    //   "displayPrice": 536
    // }, {
    //   "id": 885,
    //   "name": "Computers",
    //   "brandName": "Sports",
    //   "price": 510,
    //   "displayPrice": 101
    // }, {
    //   "id": 569,
    //   "name": "Music",
    //   "brandName": "Jewelery",
    //   "price": 329,
    //   "displayPrice": 781
    // }, {
    //   "id": 371,
    //   "name": "Electronics",
    //   "brandName": "Health",
    //   "price": 3,
    //   "displayPrice": 358
    // }, {
    //   "id": 644,
    //   "name": "Industrial",
    //   "brandName": "Computers",
    //   "price": 292,
    //   "displayPrice": 967
    // }, {
    //   "id": 1000,
    //   "name": "Movies",
    //   "brandName": "Health",
    //   "price": 829,
    //   "displayPrice": 943
    // }, {
    //   "id": 213,
    //   "name": "Shoes",
    //   "brandName": "Tools",
    //   "price": 447,
    //   "displayPrice": 750
    // }, {
    //   "id": 344,
    //   "name": "Beauty",
    //   "brandName": "Shoes",
    //   "price": 972,
    //   "displayPrice": 111
    // }, {
    //   "id": 832,
    //   "name": "Grocery",
    //   "brandName": "Home",
    //   "price": 559,
    //   "displayPrice": 321
    // }, {
    //   "id": 911,
    //   "name": "Beauty",
    //   "brandName": "Tools",
    //   "price": 440,
    //   "displayPrice": 483
    // }, {
    //   "id": 249,
    //   "name": "Industrial",
    //   "brandName": "Computers",
    //   "price": 614,
    //   "displayPrice": 454
    // }, {
    //   "id": 192,
    //   "name": "Health",
    //   "brandName": "Sports",
    //   "price": 91,
    //   "displayPrice": 256
    // }, {
    //   "id": 168,
    //   "name": "Home",
    //   "brandName": "Health",
    //   "price": 957,
    //   "displayPrice": 215
    // }, {
    //   "id": 840,
    //   "name": "Tools",
    //   "brandName": "Toys",
    //   "price": 156,
    //   "displayPrice": 34
    // }, {
    //   "id": 536,
    //   "name": "Home",
    //   "brandName": "Music",
    //   "price": 726,
    //   "displayPrice": 804
    // }, {
    //   "id": 501,
    //   "name": "Beauty",
    //   "brandName": "Automotive",
    //   "price": 152,
    //   "displayPrice": 991
    // }, {
    //   "id": 693,
    //   "name": "Health",
    //   "brandName": "Grocery",
    //   "price": 834,
    //   "displayPrice": 848
    // }, {
    //   "id": 148,
    //   "name": "Books",
    //   "brandName": "Garden",
    //   "price": 912,
    //   "displayPrice": 407
    // }, {
    //   "id": 918,
    //   "name": "Electronics",
    //   "brandName": "Home",
    //   "price": 388,
    //   "displayPrice": 239
    // }, {
    //   "id": 61,
    //   "name": "Outdoors",
    //   "brandName": "Books",
    //   "price": 209,
    //   "displayPrice": 226
    // }, {
    //   "id": 817,
    //   "name": "Books",
    //   "brandName": "Home",
    //   "price": 116,
    //   "displayPrice": 389
    // }, {
    //   "id": 830,
    //   "name": "Kids",
    //   "brandName": "Beauty",
    //   "price": 370,
    //   "displayPrice": 760
    // }, {
    //   "id": 473,
    //   "name": "Books",
    //   "brandName": "Beauty",
    //   "price": 120,
    //   "displayPrice": 300
    // }, {
    //   "id": 704,
    //   "name": "Jewelery",
    //   "brandName": "Baby",
    //   "price": 736,
    //   "displayPrice": 669
    // }, {
    //   "id": 479,
    //   "name": "Tools",
    //   "brandName": "Movies",
    //   "price": 325,
    //   "displayPrice": 607
    // }, {
    //   "id": 777,
    //   "name": "Grocery",
    //   "brandName": "Tools",
    //   "price": 26,
    //   "displayPrice": 308
    // }, {
    //   "id": 3,
    //   "name": "Electronics",
    //   "brandName": "Grocery",
    //   "price": 37,
    //   "displayPrice": 436
    // }, {
    //   "id": 713,
    //   "name": "Kids",
    //   "brandName": "Home",
    //   "price": 341,
    //   "displayPrice": 417
    // }, {
    //   "id": 392,
    //   "name": "Industrial",
    //   "brandName": "Baby",
    //   "price": 195,
    //   "displayPrice": 489
    // }, {
    //   "id": 265,
    //   "name": "Grocery",
    //   "brandName": "Clothing",
    //   "price": 17,
    //   "displayPrice": 228
    // }]
    // }
    // return Observable.of(data);
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
