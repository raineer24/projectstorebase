import { Product } from './../../core/models/product';
import { Item } from './../../core/models/item';
import { AppState } from './../../interfaces';
import { ProductState } from './product-state';
import { createSelector } from 'reselect';
import { Map, List, fromJS } from 'immutable';

// Base product state selector function
export function getProductState(state: AppState): ProductState {
  return state.products;
}

// ******************** Individual selectors ***************************
export function fetchProducts(state: ProductState) {
  const ids = state.productIds.toJS();
  const productEntities = state.productEntities.toJS();
  return ids.map(id => productEntities[id]);
}

export function fetchAllTaxonomies(state: ProductState) {
  return state.categories.toJS();
}

const fetchSelectedProduct = function (state: ProductState): Item {
  return state.selectedProduct;
};

// *************************** PUBLIC API's ****************************
export const getSelectedProduct = createSelector(getProductState, fetchSelectedProduct);
export const getProducts = createSelector(getProductState, fetchProducts);
export const getTaxonomies = createSelector(getProductState, fetchAllTaxonomies);
