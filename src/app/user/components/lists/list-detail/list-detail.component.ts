import { Store } from '@ngrx/store';
import { AppState } from '../../../../interfaces';
import { UserActions } from '../../../actions/user.actions';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../../environments/environment';
import { Item } from '../../../../core/models/item'
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.scss']
})
export class ListDetailComponent implements OnInit {
  routeSubscription$: Subscription;
  listSubscription$: Subscription;
  listId: number;
  items: Item[];

  constructor(
    private store: Store<AppState>,
    private userService: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.routeSubscription$ = this.route.params.subscribe(
      (params: any) => {
        this.listId = params['id'];
        this.listSubscription$ =
          this.userService
          .getListItems(this.listId)
          .subscribe(items => this.items = items);
     }
    );

  }

}
