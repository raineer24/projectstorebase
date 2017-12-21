import { Router } from '@angular/router';
import { SearchActions } from './../../home/reducers/search.actions';
import { getTaxonomies } from './../../product/reducers/selectors';
import { getTotalCartItems } from './../../checkout/reducers/selectors';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../interfaces';
import { getAuthStatus } from '../../auth/reducers/selectors';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';
import { AuthActions } from '../../auth/actions/auth.actions';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  isAuthenticated: Observable<boolean>;
  totalCartItems: Observable<number>;
  categories$: Observable<any>;
  asyncSelected: string;
  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;
  dataSource: Observable<any>;
  statesComplex: any[] = [
     { id: 1, name: 'Alabama', region: 'South' },
     { id: 2, name: 'Alaska', region: 'West' },
     { id: 3, name: 'Arizona', region: 'West'},
     { id: 4, name: 'Arkansas', region: 'South' },
     { id: 5, name: 'California', region: 'West' },
     { id: 6, name: 'Colorado', region: 'West' },
     { id: 7, name: 'Connecticut', region: 'Northeast' },
     { id: 8, name: 'Delaware', region: 'South' },
     { id: 9, name: 'Florida', region: 'South' },
     { id: 10, name: 'Georgia', region: 'South' }];

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private authActions: AuthActions,
    private productService: ProductService,
    private searchActions: SearchActions,
    private router: Router
  ) {
    this.categories$ = this.store.select(getTaxonomies);
    this.dataSource = Observable.create((observer: any) => {
      // Runs on every search
      observer.next(this.asyncSelected);
    }).mergeMap((token: string) => this.getStatesAsObservable(token)).do(res => { JSON.stringify(res)
    });
    // }).mergeMap((token: string) => this.productService.getItemsBySearch(token))
    // .do(res => { JSON.stringify(res)})
    // .map(res => { res = res.list });
  }

  ngOnInit() {
    // this.store.dispatch(this.authActions.authorize());
    this.isAuthenticated = this.store.select(getAuthStatus);
    this.totalCartItems = this.store.select(getTotalCartItems);
  }

  selectCategory(category) {
    this.router.navigateByUrl('/');
    // this.store.dispatch(this.searchActions.addFilter(category));
  }

  autoComplete(event){
    const text = event.target.value;
    if(text.length > 1) {
      console.log(event.target.value);
    }
  }

  getStatesAsObservable(token: string): Observable<any> {
    let query = new RegExp(token, 'ig');

    return Observable.of(
      this.statesComplex.filter((state: any) => {
        return query.test(state.name);
      })
    );
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  changeTypeaheadNoResults(e: boolean): void {
    this.typeaheadNoResults = e;
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    console.log('Selected value: ', e.value);
  }

}
