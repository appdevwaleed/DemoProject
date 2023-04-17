import {
  GET_CART_DETAIL,
  REMOVE_CART_PRODUCTS,
  UPDATE_CART,
  CLEAR_CART,
  GET_ALL_PROMO_CODES,
  VERIFY_PROMO_CODE,
  REMOVE_PROMO_CODE,
  PLACE_ORDER,
  LIST_OF_PAYMENTS,
  GETWEBURL,
  GET_ALL_PROMO_CODES_CAB_ORDER,
  VERIFY_PROMO_CODE_CAB_ORDER,
  VENDOR_TABLE_CART,
  SCHEDULE_ORDER,
  CART_PRODUCT_SCHEDULE,
  TIP_AFTER_ORDER,
  STRIPE_INTENT,
  UPDATE_STRIPE_PAID_STATUS,
  USE_WALLET,
  ADD_TIP,
  USE_WALLET_FOR_DELIVERY,
  REMOVE_DELIVERY_PROMO_CODE,
  CREATE_DELIVERY_CART,
  UPDATE_STRIPE_PAID_STATUS_DELIVERY,
  CREATE_DELIVERY_CART_STRIPE_INTENT,
  ADD_SPECIAL_INSTRUCTIONS,
} from '../../config/urls';
import {
  apiGet,
  apiPost,
  removeItem,
  saveSelectedAddress,
  setItem,
} from '../../utils/utils';
import store from '../store';
import types from '../types';
const {dispatch} = store;

export const saveAddress = (data) => {
  saveSelectedAddress(data).then((suc) => {
    dispatch({
      type: types.SELECTED_ADDRESS,
      payload: data,
    });
  });
};
function isObjEmpty (obj) {
  return Object.keys(obj).length === 0;
}
//Get Cart Detail
export function getCartDetail(url, data = {}, headers = {}) {
  let updatedUrl = GET_CART_DETAIL;
  if(!isObjEmpty(url)){
    updatedUrl= updatedUrl+url;
    console.log("getCartDetail",isObjEmpty(url));
  }
  return new Promise((resolve, reject) => {
    apiGet(updatedUrl , data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//add delete product from cart
export const increaseDecreaseItemQty = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(UPDATE_CART, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const cartItemQty = (data) => {
  setItem('cartItemCount', data).then((suc) => {
    dispatch({
      type: types.CART_ITEM_COUNT,
      payload: data,
    });
  });
};

//remove product from cart
export const removeProductFromCart = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(REMOVE_CART_PRODUCTS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//remove product from cart
export const clearCart = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiGet(CLEAR_CART, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Get all promo codes
export const getAllPromoCodes = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_ALL_PROMO_CODES, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Get all promo codes for cab
export const getAllPromoCodesForCaB = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_ALL_PROMO_CODES_CAB_ORDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Verify Promo code

export const verifyPromocode = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(VERIFY_PROMO_CODE, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//remove Promo Code
export const removeDeliveryPromocode = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(REMOVE_DELIVERY_PROMO_CODE, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};


//add delivery order to cart
export const createDeliveryCart = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(CREATE_DELIVERY_CART, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};


//add stripe Intent for delivery order  cart
export const createDeliveryCartStripeIntent = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(CREATE_DELIVERY_CART_STRIPE_INTENT, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
//add special instructions
export const addSpecialInstructions = (data, headers = {}) => {
  console.log("THIS IS MY DATA FOR INST",data)
  return new Promise((resolve, reject) => {
    apiPost(ADD_SPECIAL_INSTRUCTIONS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
//Verify Promo code for cab orders

export const verifyPromocodeForCabOrders = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(VERIFY_PROMO_CODE_CAB_ORDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Remove Promo code

export const removePromoCode = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(REMOVE_PROMO_CODE, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};


//useWallet
export const useWallet = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(USE_WALLET, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//useWallet  for delivery
export const useWalletForDelivery = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(USE_WALLET_FOR_DELIVERY, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};



//Plce order code

export const placeOrder = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(PLACE_ORDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Get List of payment method
export function getListOfPaymentMethod(query = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(LIST_OF_PAYMENTS + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function postStripeIntent( data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(STRIPE_INTENT, data, headers)
      .then((res) => {
        console.log(res,'MY RESPONSE MY RESPONSE')
        resolve(res);
      })
      .catch((error) => {
        console.log(error,'MY RESPONSE MY RESPONSE ERROR')
        reject(error);
      });
  });
}

//Get List of payment method
export function openPaymentWebUrl(query = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(GETWEBURL + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function vendorTableCart(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(VENDOR_TABLE_CART, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const scheduledOrder = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(SCHEDULE_ORDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};



export const updateStripePaidStatus = (data, headers = {}) => {
  console.log("I am called updateStripePaidStatus")
  return new Promise((resolve, reject) => {
    apiPost(UPDATE_STRIPE_PAID_STATUS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateStripePaidStatusDelivery = (data, headers = {}) => {
  console.log("I am called updateStripePaidStatusDelivery")
  return new Promise((resolve, reject) => {
    apiPost(UPDATE_STRIPE_PAID_STATUS_DELIVERY, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const cartProductSchedule = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(CART_PRODUCT_SCHEDULE, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const tipAfterOrder = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(TIP_AFTER_ORDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const addTip = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(ADD_TIP, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};