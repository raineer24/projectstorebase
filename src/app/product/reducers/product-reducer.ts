import { Taxonomy } from './../../core/models/taxonomy';
import { Product } from './../../core/models/product';
import { Item } from './../../core/models/item';
import { Category } from './../../core/models/category';
import { ProductActions } from './../actions/product-actions';
import { ProductState, ProductStateRecord } from './product-state';
import { Action, ActionReducer } from '@ngrx/store';
import { Map } from 'immutable';


export const initialState: ProductState = new ProductStateRecord() as ProductState;

export const productReducer: ActionReducer<ProductState> =
  (state: ProductState = initialState, { type, payload }: Action): ProductState => {
  let _items: Item[], itemIds: number[], itemEntities;

  switch (type) {

    case ProductActions.GET_PRODUCT_DETAIL_SUCCESS:
      return state.merge({
        selectedProduct: payload
      }) as ProductState;

    case ProductActions.GET_ALL_PRODUCTS_SUCCESS:
      _items = payload.items.list;
      itemIds = _items.map(product => product.id);
      itemEntities = _items.reduce((products: { [id: number]: Item }, product: Item) => {
        return Object.assign(products, {
          [product.id]: product
        });
      }, { });
      return state.merge({
        productIds: itemIds,
        productEntities: itemEntities
      }) as ProductState;

    case ProductActions.GET_ALL_TAXONOMIES_SUCCESS:
      const _categories: Category[] = payload.categories.categories;
      return state.merge({
        categories: _categories
      }) as ProductState;

    case ProductActions.GET_ITEMS_BY_KEYWORD_SUCCESS:
      _items = payload.items.list;
      itemIds = _items.map(product => product.id);
      itemEntities = _items.reduce((products: { [id: number]: Item }, product: Item) => {
        return Object.assign(products, {
          [product.id]: product
        });
      }, { });
      return state.merge({
        productIds: itemIds,
        productEntities: itemEntities
      }) as ProductState;

    case ProductActions.GET_ITEMS_BY_CATEGORY_SUCCESS:
      _items = payload.items.list;
      itemIds = _items.map(product => product.id);
      itemEntities = _items.reduce((products: { [id: number]: Item }, product: Item) => {
        return Object.assign(products, {
          [product.id]: product
        });
      }, { });
      return state.merge({
        productIds: itemIds,
        productEntities: itemEntities
      }) as ProductState;

    // case ProductActions.GET_ITEMS_BY_SEARCH_SUCCESS:
    //   const _itemsBySearch: Item[] = payload.items.list;
    //   const itemsBySearchIds: number[] = _itemsBySearch.map(product => product.id);
    //   const itemsBySearchEntities = _itemsBySearch.reduce((products: { [id: number]: Item }, product: Item) => {
    //     return Object.assign(products, {
    //       [product.id]: product
    //     });
    //   }, { });
    //   return state.merge({
    //     productIds: itemsBySearchIds,
    //     productEntities: itemsBySearchEntities
    //   }) as ProductState;

    case ProductActions.ADD_SELECTED_ITEM:
      return state.merge({
        selectedProductId: payload.id,
        selectedProduct: payload
      }) as ProductState;

    case ProductActions.REMOVE_SELECTED_ITEM:
      return state.merge({
        selectedProductId: null,
        selectedProduct: Map({})
      }) as ProductState;

    default:
      return state;
  }
};
