import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { HttpService } from './http';
import { Auth } from '../models/user';
import { AppState } from '../../interfaces';
import { AuthActions } from '../../auth/actions/auth.actions';
import { UserActions } from '../../user/actions/user.actions';
import { CheckoutActions } from '../../checkout/actions/checkout.actions';


@Injectable()
export class AuthService {

  /**
   * Creates an instance of AuthService.
   * @param {HttpService} http
   * @param {AuthActions} actions
   * @param {Store<AppState>} store
   *
   * @memberof AuthService
   */
  constructor(
    private http: HttpService,
    private actions: AuthActions,
    private userActions: UserActions,
    private checkoutActions: CheckoutActions,
    private store: Store<AppState>,
  ) {

  }


  /**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   * @memberof AuthService
   */
  loginFB(data): Observable<any> {
    return this.http.post(
      'v1/user/account/login', data)
      .map((res: Response) => {
       data = res.json();
      if (data.message == 'Found') {
        // Setting token after login
        this.setTokenInLocalStorage(data);
        this.store.dispatch(this.actions.loginSuccess());
      } else {
        data.error = true;
        this.http.loading.next({
          loading: false,
          hasError: true,
          hasMsg: 'Please enter valid Credentials'
        });
      }
      return data;
    });
    // catch should be handled here with the http observable
    // so that only the inner obs dies and not the effect Observable
    // otherwise no further login requests will be fired
    // MORE INFO https://youtu.be/3LKMwkuK0ZE?t=24m29s
  }

  /**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   * @memberof AuthService
   */
  login(data): Observable<any> {
    return this.http.post(
      'v1/user/account/login', data)
      .map((res: Response) => {
      data = res.json();
      if (data.message == 'Found') {
        // Setting token after login
        this.setTokenInLocalStorage(data);
        this.store.dispatch(this.actions.loginSuccess());
      } else {
        data.error = true;
        this.http.loading.next({
          loading: false,
          hasError: true,
          hasMsg: 'Please enter valid Credentials'
        });
      }
      return data;
    });
    // catch should be handled here with the http observable
    // so that only the inner obs dies and not the effect Observable
    // otherwise no further login requests will be fired
    // MORE INFO https://youtu.be/3LKMwkuK0ZE?t=24m29s
  }

  /**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   * @memberof AuthService
   */
  checkPartnerBuyer(id): Observable<any>{
    return this.http.get(
      `v1/user/account/partnerbuyeruser/${id}`)
      .map((res: Response) => {
      let data = res.json();
      if (data.message == 'Found'){
        if(data.status == 'enabled'){
          return true;
        }
      } else { return false; }
    } );
  }

  /**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   * @memberof AuthService
   */
  getPartnerBuyerUser(id): Observable<any>{
    return this.http.get(
      `v1/user/account/partnerbuyeruser/${id}`)
      .map((res: Response) => {
      let data = res.json();
      return data;
    } );
  }

  updatePartnerBuyerUser(data): Observable<any>{
    return this.http.post(`v1/user/account/partnerbuyeruser/${data.useraccount_id}/save`,data)
    .map(res => {
      return res.json();
    }).catch(err => Observable.empty());
  }

  /**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   * @memberof AuthService
   */
  register(data): Observable<any> {
    return this.http.post(
      'v1/user/account/save', data
    ).map((res: Response) => {
      let response = res.json();
      if (response.message == 'Saved') {
        // Setting token after login
        const d = Date.now();
        this.setTokenInLocalStorage({
          id: response.id,
          firstName: data.firstName,
          lastName: data.lastName,
          mobileNumber: data.mobileNumber,
          gender: data.gender,
          email: data.username,
          username: data.username,
          dataCreated: d,
          dateUpdated: d,
          dateAuthorized: d,
          dateTime: d,
        });
        this.store.dispatch(this.actions.loginSuccess());
      } else {
        response.error = true;
        this.http.loading.next({
          loading: false,
          hasError: true,
          hasMsg: 'Email already in use'
        });
      }
      return response;
    });
    // catch should be handled here with the http observable
    // so that only the inner obs dies and not the effect Observable
    // otherwise no further login requests will be fired
    // MORE INFO https://youtu.be/3LKMwkuK0ZE?t=24m29s
  }

  /**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   * @memberof AuthService
   */
  update(id, data, isMsg = true): Observable<any> {
    return this.http.put(
      `v1/user/account/${ id }/save`, data
    ).map((res: Response) => {
      let result = res.json();
      if (result.message.indexOf('Updated') >= 0) {
        let storedData = JSON.parse(localStorage.getItem('user'));
        data.message = result.message;
        for(let key in data) {
          if(data.hasOwnProperty(key)) {
            storedData[key] = data[key];
          }
        }
        this.setTokenInLocalStorage(storedData);
        if (isMsg) {
          this.http.loading.next({
            loading: false,
            isSuccess: true,
            message: `Profile was successfully saved.`,
            reset: 4500,
          });
        }
      } else {
        // this.http.loading.next({
        //   loading: false,
        //   hasError: true,
        //   hasMsg: 'Please enter valid Credentials'
        // });
      }
      return result;
    });
    // catch should be handled here with the http observable
    // so that only the inner obs dies and not the effect Observable
    // otherwise no further login requests will be fired
    // MORE INFO https://youtu.be/3LKMwkuK0ZE?t=24m29s
  }
  /**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   * @memberof AuthService
   */
  changePassword(data): Observable<any> {
    return this.http.put(
      `v1/user/account/${ data.id }/changepassword`, data
    ).map((res: Response) => {
      let result = res.json();
      if (result.message.indexOf('Updated') >= 0) {
        this.http.loading.next({
          loading: false,
          success: true,
          message: `Password was successfully changed.`
        });
      } else {
        this.http.loading.next({
          loading: false,
          hasError: true,
          hasMsg: 'Error has occurred. Please try again.'
        });
      }
      return result;
    });
    // catch should be handled here with the http observable
    // so that only the inner obs dies and not the effect Observable
    // otherwise no further login requests will be fired
    // MORE INFO https://youtu.be/3LKMwkuK0ZE?t=24m29s
  }
  /**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   * @memberof AuthService
   */
  view(id): Observable<any> {
    return this.http.get(
      `v1/user/account/${ id }/view`
    ).map((res: Response) => {
      let data = res.json();
      if (data.message == 'Found') {
        this.setTokenInLocalStorage(res.json());
      } else {
        data.error = true;
        // this.http.loading.next({
        //   loading: false,
        //   hasError: true,
        //   hasMsg: 'Please enter valid Credentials'
        // });
      }
      return data;
    });
    // catch should be handled here with the http observable
    // so that only the inner obs dies and not the effect Observable
    // otherwise no further login requests will be fired
    // MORE INFO https://youtu.be/3LKMwkuK0ZE?t=24m29s
  }

  /**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   * @memberof AuthService
   */
  checkToken(data): Observable<any> {
    return this.http.post(
      'v1/user/account/token', data
    ).map((res: Response) => {
      return res.json();
    });
    // catch should be handled here with the http observable
    // so that only the inner obs dies and not the effect Observable
    // otherwise no further login requests will be fired
    // MORE INFO https://youtu.be/3LKMwkuK0ZE?t=24m29s
  }

  /**
   *
   *
   * @returns {Observable<any>}
   *
   * @memberof AuthService
   */
  authorized(): Observable<any> {
    return this.http
      .get('spree/api/v1/users')
      .map((res: Response) => res.json())
      .catch(err => Observable.empty());
    // catch should be handled here with the http observable
    // so that only the inner obs dies and not the effect Observable
    // otherwise no further login requests will be fired
    // MORE INFO https://youtu.be/3LKMwkuK0ZE?t=24m29s
  }

  /**
   *
   *
   * @returns
   *
   * @memberof AuthService
   */
  logout() {
    // return this.http.get('spree/logout.json')
    // .map((res: Response) => {
    //   // Setting token after login
    //   localStorage.removeItem('user');
    //   this.store.dispatch(this.actions.logoutSuccess());
    //   return res.json();
    // })
    // .catch(err => Observable.empty());
    localStorage.removeItem('user');
    localStorage.removeItem('pbu');
    localStorage.removeItem('PBUser');
    this.store.dispatch(this.actions.logoutSuccess());
    return Observable.empty();
  }

  /**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   * @memberof AuthService
   */
  requestPasswordReset(email): Observable<any> {
    return this.http.post(`v1/user/account/${email}/forgotpassword`, {
      email: email
    }).map((res: Response) => {
      let data = res.json();
      if (data.message.toUpperCase() === 'SUCCESS') {
        this.http.loading.next({
          loading: false,
          isSuccess: true,
          hasMsg: 'Email has been successfully sent.',
          reset: 4500,
        });
      } else {
        this.http.loading.next({
          loading: false,
          hasError: true,
          hasMsg: 'Error occurred. Please try again later.',
          reset: 4500,
        });
      }
      return data;
    });
  }

  /**
   *
   *
   * @private
   * @param {any} user_data
   *
   * @memberof AuthService
   */
  private setTokenInLocalStorage(user_data): void {
    const jsonData = JSON.stringify(user_data);
    localStorage.setItem('user', jsonData);
  }


  /**
   *
   *
   *
   * @param void
   *
   * @memberof AuthService
   */
  checkSessionPersistence(): void {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user) {
      const d = Date.now();
      const elapsedTime = d - user.dateAuthorized;
      if(elapsedTime < 1800000) { //30 minutes
        this.store.dispatch(this.actions.loginSuccess());
        this.store.dispatch(this.userActions.getUserLists());
        user.dateAuthorized = d;
        this.setTokenInLocalStorage(user)
      } else {
        localStorage.removeItem('user');
      }
    }
  }

}
