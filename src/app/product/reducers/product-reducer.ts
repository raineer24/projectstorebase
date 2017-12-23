import { Taxonomy } from './../../core/models/taxonomy';
import { Product } from './../../core/models/product';
import { Item } from './../../core/models/item';
import { Category } from './../../core/models/category';
import { ProductActions } from './../actions/product-actions';
import { ProductState, ProductStateRecord } from './product-state';
import { Action, ActionReducer } from '@ngrx/store';

export const initialState: ProductState = new ProductStateRecord() as ProductState;

export const productReducer: ActionReducer<ProductState> =
  (state: ProductState = initialState, { type, payload }: Action): ProductState => {
  switch (type) {

    case ProductActions.GET_PRODUCT_DETAIL_SUCCESS:
      return state.merge({
        selectedProduct: payload
      }) as ProductState;

    // case ProductActions.GET_ALL_PRODUCTS_SUCCESS:
    //   const _products: Product[] = payload.products.products;
    //   const productIds: number[] = _products.map(product => product.id);
    //   const productEntities = _products.reduce((products: { [id: number]: Product }, product: Product) => {
    //     return Object.assign(products, {
    //       [product.id]: product
    //     });
    //   }, { });
    //   return state.merge({
    //     productIds: productIds,
    //     productEntities: productEntities
    //   }) as ProductState;
    case ProductActions.GET_ALL_PRODUCTS_SUCCESS:
      const _products: Item[] = payload.items.list;
      const productIds: number[] = _products.map(product => product.id);
      const productEntities = _products.reduce((products: { [id: number]: Item }, product: Item) => {
        return Object.assign(products, {
          [product.id]: product
        });
      }, { });
      return state.merge({
        productIds: productIds,
        productEntities: productEntities
      }) as ProductState;

   case ProductActions.GET_ALL_TAXONOMIES_SUCCESS:
      const _categories: Category[] = payload.categories.categories;
    // const _subcategories: Category[] = payload.categories.subcategories;
    // const _newcat = Object.keys(_categories).map(k => {return _categories[k]})
    // let _newcat: Object[];
    //
    // for(let key in _categories) {
    //   _newcat.push(_categories[key])
    // }

      return state.merge({
        categories: _categories
      }) as ProductState;

    case ProductActions.GET_ITEMS_BY_CATEGORY_SUCCESS:
    const _itemsByCategory: Item[] = payload.items.list;
    const itemsByCategoryIds: number[] = _itemsByCategory.map(product => product.id);
    const itemsByCategoryEntities = _itemsByCategory.reduce((products: { [id: number]: Item }, product: Item) => {
      return Object.assign(products, {
        [product.id]: product
      });
    }, { });
      return state.merge({
        productIds: itemsByCategoryIds,
        productEntities: itemsByCategoryEntities
      }) as ProductState;
    default:
      return state;
  }
};
