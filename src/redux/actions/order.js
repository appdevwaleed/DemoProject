import {
  ACCEPT_REJECT_ORDER,
  GET_ALL_ORDERS,
  GET_ALL_VENDOR_ORDERS,
  GET_ORDER_DETAIL,
  GET_RATING_DETAIL,
  GIVE_RATING_REVIEWS,
  GET_VENDOR_REVENUE,
  GET_RETURN_ORDER_DETAIL,
  GET_RETURN_PRODUCT_DETAIL,
  UPLOAD_PRODUCT_IMAGE,
  SUBMIT_RETURN_ORDER,
  MY_PENDING_ORDERS,
  GET_ORDER_DETAIL_FOR_BILLING,
  DISPATCHER_URL,
  ORDER_RECEIPT,
} from '../../config/urls';
import { apiGet, apiPost } from '../../utils/utils';
import store from '../store';
import types from '../types';
const { dispatch } = store;

//Get Order Detail For Billing
export function getOrderDetailForBilling(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(GET_ORDER_DETAIL_FOR_BILLING + data.order_id, {}, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Get Cart Detail
export function getOrderDetail(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(GET_ORDER_DETAIL, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//add delete product from cart
export const getOrderListing = (query = '', data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiGet(GET_ALL_ORDERS + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

///VENDOR ORDERS ACTIONS

//SAVE USER'S LAST SELECTED VENDOR

export const savedSelectedVendor = (data) => {
  dispatch({
    type: types.STORE_SELECTED_VENDOR,
    payload: data,
  });
};

//get all orders of specific vendor
export const _getListOfVendorOrders = (query = '', data, headers = {}) => {
  console.log('query++++ query', query);
  console.log('query++++ data', data);
  console.log('query++++ headers', headers);
  return new Promise((resolve, reject) => {
    apiGet(GET_ALL_VENDOR_ORDERS + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//give order rating
export const giveRating = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(GIVE_RATING_REVIEWS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//accept Reject order

export const updateOrderStatus = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(ACCEPT_REJECT_ORDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// get order ratings

export const getRating = (query = '', data = {}, headers = {}) => {
  console.log(query, data, headers, 'IN ORDER>JS');
  return new Promise((resolve, reject) => {
    apiGet(GET_RATING_DETAIL + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Get revenue data
export const getRevenueData = (data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_VENDOR_REVENUE, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Get Cart Detail
export function getOrderDetailPickUp(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(DISPATCHER_URL, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Get RETUREN ORDER Detail
export function getReturnOrderDetailData(url = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(GET_RETURN_ORDER_DETAIL + url, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Get RETURN PRODUCT Detail
export function getReturnProductrDetailData(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(GET_RETURN_PRODUCT_DETAIL, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Upload return order image
export function uploadReturnOrderImage(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(UPLOAD_PRODUCT_IMAGE, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Submit return order
export function submitReturnOrder(data = {}, headers = {}) {
  console.log('headers ++', headers);
  return new Promise((resolve, reject) => {
    apiPost(SUBMIT_RETURN_ORDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function allPendingOrders(query, data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(MY_PENDING_ORDERS + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getOrderReceipt(query, data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(ORDER_RECEIPT + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
