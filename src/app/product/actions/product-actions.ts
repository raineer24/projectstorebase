import { Taxonomy } from './../../core/models/taxonomy';
import { Product } from './../../core/models/product';
import { Action } from '@ngrx/store';
import { environment } from './../../../environments/environment';

export class ProductActions {
    static GET_ALL_PRODUCTS = 'GET_ALL_PRODUCTS';
    static GET_ALL_PRODUCTS_SUCCESS = 'GET_ALL_PRODUCTS_SUCCESS';
    static GET_PRODUCT_DETAIL = 'GET_PRODUCT_DETAIL';
    static GET_PRODUCT_DETAIL_SUCCESS = 'GET_PRODUCT_DETAIL_SUCCESS';
    static CLEAR_SELECTED_PRODUCT = 'CLEAR_SELECTED_PRODUCT';
    static GET_ALL_TAXONOMIES = 'GET_ALL_TAXONOMIES';
    static GET_ALL_TAXONOMIES_SUCCESS = 'GET_ALL_TAXONOMIES_SUCCESS';
    static GET_ITEMS_BY_CATEGORY = "GET_ITEMS_BY_CATEGORY";
    static GET_ITEMS_BY_CATEGORY_SUCCESS = "GET_ITEMS_BY_CATEGORY_SUCCESS";
    static GET_ITEMS_BY_KEYWORD = "GET_ITEMS_BY_KEYWORD";
    static GET_ITEMS_BY_KEYWORD_SUCCESS = "GET_ITEMS_BY_KEYWORD_SUCCESS";
    static ADD_SELECTED_ITEM = "ADD_SELECTED_ITEM";
    static REMOVE_SELECTED_ITEM = "REMOVE_SELECTED_ITEM"

    getAllProducts(limit: number = environment.ITEMS_PER_PAGE, offset: number = 0): Action {
        return {
          type: ProductActions.GET_ALL_PRODUCTS,
          payload: {
            limit: limit,
            offset: offset
          }
        };
    }

    getProductDetail(id: string): Action {
        return {
            type: ProductActions.GET_PRODUCT_DETAIL,
            payload: id
        };
    }

    // change products type to Product[]
    getAllProductsSuccess(products: any): Action {
        return {
            type: ProductActions.GET_ALL_PRODUCTS_SUCCESS,
            payload: products
         };
    }

    getProductDetailSuccess(product: Product): Action {
        return {
            type: ProductActions.GET_PRODUCT_DETAIL_SUCCESS,
            payload: product
        };
    }

    clearSelectedProduct(): Action {
        return { type: ProductActions.CLEAR_SELECTED_PRODUCT };
    }

    getAllTaxonomies(): Action {
        return { type: ProductActions.GET_ALL_TAXONOMIES };
    }

    getAllTaxonomiesSuccess(taxonomies: any): Action {
        return {
            type: ProductActions.GET_ALL_TAXONOMIES_SUCCESS,
            payload: taxonomies
        };
    }

    getItemsByKeyword(keyword: string, limit: number = environment.ITEMS_PER_PAGE, offset: number = 0): Action {
        return {
            type: ProductActions.GET_ITEMS_BY_KEYWORD,
            payload: {
              keyword: keyword,
              limit: limit,
              offset: offset
            }
        };
    }

    getItemsByKeywordSuccess(items: any): Action {
        return {
            type: ProductActions.GET_ITEMS_BY_KEYWORD_SUCCESS,
            payload: items
        };
    }

    getItemsByCategory(category: any, limit: number = environment.ITEMS_PER_PAGE, offset: number = 0): Action {
        return {
            type: ProductActions.GET_ITEMS_BY_CATEGORY,
            payload: {
              id: category.id,
              level: category.level,
              limit: limit,
              offset: offset
            }
        };
    }

    getItemsByCategorySuccess(items: any): Action {
        return {
            type: ProductActions.GET_ITEMS_BY_CATEGORY_SUCCESS,
            payload: items
        };
    }

    addSelectedItem(item: any): Action {
        return {
            type: ProductActions.ADD_SELECTED_ITEM,
            payload: item
        };
    }

    removeSelectedItem(): Action {
        return {
            type: ProductActions.REMOVE_SELECTED_ITEM
        };
    }

}
