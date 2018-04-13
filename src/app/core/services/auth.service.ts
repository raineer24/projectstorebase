import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { HttpService } from './http';
import { AppState } from '../../interfaces';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../auth/actions/auth.actions';
import { UserActions } from '../../user/actions/user.actions';
import { Auth } from '../models/user';
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
    private store: Store<AppState>
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
        return true;
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
  register(data): Observable<any> {
    return this.http.post(
      'v1/user/account/save', data
    ).map((res: Response) => {
      let response = res.json();
      console.log(data)
      if (response.message == 'Saved') {
        // Setting token after login
        const d = Date.now();
        this.setTokenInLocalStorage({
          id: response.id,
          firstName: data.firstName,
          lastName: data.lastName,
          mobileNumber: data.mobileNumber,
          gender: data.gender,
          dataCreated: d,
          dateUpdated: d,
          dateAuthorized: d,
          dateTime: d
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
  update(id, data): Observable<any> {
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
        this.http.loading.next({
          loading: false,
          success: true,
          message: `Profile was successfully saved.`
        });
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
    this.store.dispatch(this.actions.logoutSuccess());
    return Observable.empty();
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
