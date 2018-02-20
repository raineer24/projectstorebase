import { Action, ActionReducer } from '@ngrx/store';
import { UserState, UserStateRecord } from './user.state';
import { UserActions } from '../actions/user.actions';

export const initialState: UserState = new UserStateRecord() as UserState;

export /**
 *
 *
 * @param {UserState} [state=initialState]
 * @param {Action} { type, payload }
 * @returns {UserState}
 */
const userReducer: ActionReducer<UserState> =
  (state: UserState = initialState, { type, payload }: Action): UserState => {
    let _list, listEntities;

    switch (type) {
      case UserActions.GET_USER_ORDERS_SUCCESS:
        return state.merge({ orders: payload }) as UserState;

      case UserActions.GET_USER_LISTS_SUCCESS:
        const _lists = payload;
        listEntities = _lists.map(list => {
          return {
            id: list.id,
            name: list.name,
            description: list.description,
            userId: list.useraccount_id
          }
        })
        return state.merge({ lists: listEntities }) as UserState;

      case UserActions.CREATE_USER_LIST_SUCCESS:
        _list = payload;
        listEntities = state.lists;

        return state.merge({ lists: listEntities.push(_list) }) as UserState;

      case UserActions.UPDATE_USER_LIST_SUCCESS:
        return state.merge({ lists: payload }) as UserState;

      default:
        return state;
    }
  };
