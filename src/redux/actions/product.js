import {
  ADD_REMOVE_TO_WISHLIST,
  GET_DATA_BY_CATEGORY,
  GET_DATA_BY_CATEGORY_FILTERS,
  GET_DATA_BY_VENDOR_FILTERS,
  GET_PRODUCT_DATA_BY_PRODUCTID,
  GET_PRODUCT_DATA_BY_VENDORID,
  GET_PRODUCT_DATA_BASED_VARIANTS,
  GET_WISHLIST_PRODUCT,
  TRANSACTION_HISTORY,
  ADD_PRODUCT_TO_CART,
  GET_ALL_PRODUCTSBY_STORE_ID,
  MY_WALLET,
  CHECK_VENDORS,
} from '../../config/urls';
import {apiGet, apiPost, setWalletData} from '../../utils/utils';
import store from '../store';
import types from '../types';
const {dispatch} = store;

// save vendor listing and category data
export function saveProductListingAndCategoryInfo(data) {
  dispatch({
    type: types.PRODUCT_LIST_DATA,
    payload: data,
  });
}

export function storeWishList(data) {}

//Get all Products by Vendor id

export function getProductByVendorId(query = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(GET_PRODUCT_DATA_BY_VENDORID + query, data, headers) //GET_PRODUCT_DATA_BY_VENDORID
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Get all Products by Vendor id

export function getProductByVendorCategoryId(
  query = '',
  data = {},
  headers = {},
) {
  return new Promise((resolve, reject) => {
    apiGet(GET_PRODUCT_DATA_BY_VENDORID + query, data, headers) //GET_PRODUCT_DATA_BY_VENDORID
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Get Category data
export function getProductByCategoryId(query = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    let url = GET_DATA_BY_CATEGORY + query;
    console.log("getProductByCategoryId", url);
    apiGet(url,  data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

///Add Product to Cartr
export const addProductsToCart = (data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(ADD_PRODUCT_TO_CART, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

///get Product By Category filter
export const getProductByCategoryFilters = (
  query = '',
  data = {},
  headers = {},
) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_DATA_BY_CATEGORY_FILTERS + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

///get Product By Category filter
export const getProductByVendorFilters = (
  query = '',
  data = {},
  headers = {},
) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_DATA_BY_VENDOR_FILTERS + query, data, headers) //GET_DATA_BY_VENDOR_FILTERS
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//get Product Detail Based on variants
export function getProductDetailByVariants(
  query = '',
  data = {},
  headers = {},
) {
  return new Promise((resolve, reject) => {
    apiPost(GET_PRODUCT_DATA_BASED_VARIANTS + query, data, headers)
      .then((res) => {
        // dispatch({
        //   type: types.PRODUCT_DETAIL,
        //   payload: res.data.products,
        // });
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//get Product Detail
export function getProductDetailByProductId(
  query = '',
  data = {},
  headers = {},
) {
  return new Promise((resolve, reject) => {
    apiGet(GET_PRODUCT_DATA_BY_PRODUCTID + query, data, headers)
      .then((res) => {
        // dispatch({
        //   type: types.PRODUCT_DETAIL,
        //   payload: res.data.products,
        // });
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getWishlistProducts(query = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(GET_WISHLIST_PRODUCT + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        console.log(error, 'error>>>>>');
        reject(error);
      });
  });
}

export function updateProductWishListData(query = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    let url = ADD_REMOVE_TO_WISHLIST + query;
    apiGet(ADD_REMOVE_TO_WISHLIST + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

export const setWallet = (data) => {
  dispatch({
    type: types.WALLET_DATA,
    payload: data,
  });
};

export function walletHistory(query = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(MY_WALLET + query, data, headers)
      .then((res) => {
        setWalletData(res.data).then((suc) => {
          setWallet(res.data);
          resolve(res);
        });

        resolve(res);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

//Get Product by category id for specific store
export function getProductBySpecificId(query = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(GET_ALL_PRODUCTSBY_STORE_ID + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function checkSingleVendor(data = {}, header = {}) {
  console.log('Sending data', data);
  console.log('header==>>>', header);
  return new Promise((resolve, reject) => {
    apiPost(CHECK_VENDORS, data, header)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
