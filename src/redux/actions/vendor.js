import {GET_DATA_BY_CATEGORY, GET_VENDOR_DETAIL} from '../../config/urls';
import {apiGet, apiPost} from '../../utils/utils';
import store from '../store';
import types from '../types';
const {dispatch} = store;

// save vendor listing and category data

export function saveVendorListingAndCategoryInfo(data) {
  dispatch({
    type: types.CATEGORY_INFO_DATA,
    payload: data,
  });
}

//Get vendor info and Category data
export function getDataByCategoryId(query = '', data = {}, headers = {}) {
  console.log(data, 'data');
  return new Promise((resolve, reject) => {
    apiGet(GET_DATA_BY_CATEGORY + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Get vendor info and Category data
export function getVendorDetail(data = {}, headers = {}) {
  let url = GET_VENDOR_DETAIL;
  console.log("getVendorDetailurl", url)
  console.log("getVendorDetailurl data", data)

  
  return new Promise((resolve, reject) => {
    apiPost(url, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Get vendor info and Category data
export function getSubcategoryDetail(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(GET_VENDOR_DETAIL, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
