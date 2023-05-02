// export const API_BASE_URL = 'https://runrun.ae/api/v1';  // Test 
export const API_BASE_URL = 'https://staging.runrun.ae/api/v1';  // staging 
export const getApiUrl = (endpoint) => API_BASE_URL + endpoint;



//export const SEND_OTP = getApiUrl('/auth/sendOtp');

export const LOGIN_BY_USERNAME = getApiUrl('/auth/loginViaUsername');
export const PHONE_LOGIN_OTP = getApiUrl('/auth/verify/phoneLoginOtp');
export const LOGIN_API = getApiUrl('/auth/login');
export const SIGN_UP_API = getApiUrl('/auth/register');
export const FORGOT_API = getApiUrl('/auth/forgotPassword');
export const APP_INITIAL_SETTINGS = getApiUrl('/header');
export const HOMEPAGE_DATA_URL = getApiUrl('/delivery-homepage');///homepage delivery-homepage
export const GET_DATA_BY_CATEGORY = getApiUrl('/category');
export const GET_PRODUCT_DATA_BY_PRODUCTID = getApiUrl('/product');
export const GET_PRODUCT_DATA_BY_VENDORID = getApiUrl('/vendor');
export const GET_PRODUTC_DATA_BY_BRANDID = getApiUrl('/brand');
export const CHECK_VENDORS = getApiUrl('/checkIsolateSingleVendor');
export const GET_WISHLIST_PRODUCT = getApiUrl('/wishlists'); 
export const ADD_REMOVE_TO_WISHLIST = getApiUrl('/wishlist/update');
export const PROFILE_BASIC_INFO = getApiUrl('/update/profile');
export const UPLOAD_PROFILE_IMAGE = getApiUrl('/update/image');
export const CHANGE_PASSWORD = getApiUrl('/changePassword');
export const CONTACT_US = getApiUrl('/contact-us');
export const VERIFY_ACCOUNT = getApiUrl('/auth/verifyAccount');
export const RESEND_OTP = getApiUrl('/auth/sendToken');
export const INCREASE_ITEM_QNT = getApiUrl('/cart/increaseItem');
export const DECREASE_ITEM_QNT = getApiUrl('/cart/decreaseItem');
export const GET_DATA_BY_CATEGORY_FILTERS = getApiUrl('/category/filters');
export const GET_DATA_BY_VENDOR_FILTERS = getApiUrl('/vendor/filters');
export const GET_PRODUCT_DATA_BASED_VARIANTS = getApiUrl('/productByVariant');
export const GET_BRANDPRODUCTS_DATA_BASED_VARIANTS =
  getApiUrl('/brand/filters');
export const MY_WALLET = getApiUrl('/myWallet');
export const SOCAIL_LOGIN_API = getApiUrl('/social/login');
export const ADD_PRODUCT_TO_CART = getApiUrl('/cart/add');
export const GET_CART_DETAIL = getApiUrl('/cart/list');
export const REMOVE_CART_PRODUCTS = getApiUrl('/cart/remove');
export const UPDATE_CART = getApiUrl('/cart/updateQuantity');
export const SEARCH = getApiUrl('/search/all');
export const CLEAR_CART = getApiUrl('/cart/empty');
export const ADD_ADDRESS = getApiUrl('/user/address');
export const SEARCH_BY_CATEGORY = getApiUrl('/search/category');
export const SEARCH_BY_VENDOR = getApiUrl('/search/vendor');
export const SEARCH_BY_BRAND = getApiUrl('/search/brand');
export const UPDATE_ADDRESS = getApiUrl('/user/address');
export const GET_ALL_PROMO_CODES = getApiUrl('/promo-code/list');
export const VERIFY_PROMO_CODE = getApiUrl('/promo-code/verify');
export const RESET_PASSWORD = getApiUrl('/auth/resetPassword');
export const REMOVE_PROMO_CODE = getApiUrl('/promo-code/remove');
export const GET_ALL_CELEBRITY = getApiUrl('/celebrity');
export const GET_ADDRESS = getApiUrl('/addressBook');
export const DELETE_ADDRESS = getApiUrl('/delete/address');
export const SET_PRIMARY_ADDRESS = getApiUrl('/primary/address');
export const GET_PRODUCTS_BASED_ON_CELEBRITYFILTER =
  getApiUrl('/celebrity/filters');
export const GET_PRODUCTS_BASED_ON_CELEBRITY = getApiUrl('/celebrityProducts');
export const PLACE_ORDER = getApiUrl('/place/order');
export const GET_ORDER_DETAIL = getApiUrl('/order-detail');
export const GET_ORDER_DETAIL_FOR_BILLING = getApiUrl(
  '/order/orderDetails_for_notification/',
);
export const GET_ALL_ORDERS = getApiUrl('/orders');
export const GET_VENDOR_DETAIL = getApiUrl('/vendor/category/list');
export const SEND_REFFERAL_CODE = getApiUrl('/send/referralcode');
export const GIVE_RATING_REVIEWS = getApiUrl('/rating/update-product-rating');
export const GET_RATING_DETAIL = getApiUrl('/rating/get-product-rating');
export const ACCEPT_REJECT_ORDER = getApiUrl('/update/order/status');

export const GET_ALL_VENDOR_ORDERS = getApiUrl('/mystore');
export const GET_ALL_PRODUCTSBY_STORE_ID = getApiUrl('/mystore/product/list');
export const GET_ALL_CAR_AND_PRICE = getApiUrl(
  '/pickup-delivery/get-list-of-vehicles',
);

export const PLACE_DELIVERY_ORDER = getApiUrl('/pickup-delivery/create-order');
export const LIST_OF_PAYMENTS = getApiUrl('/payment/options');
export const LIST_OF_CMS = getApiUrl('/cms/page/list');
export const CMS_PAGE_DETAIL = getApiUrl('/cms/page/detail');

export const GET_VENDOR_REVENUE = getApiUrl('/store/revenue');

export const GETWEBURL = getApiUrl('/payment');
export const GET_ALL_PROMO_CODES_CAB_ORDER = getApiUrl(
  '/pickup-delivery/promo-code/list',
);
export const VERIFY_PROMO_CODE_CAB_ORDER = getApiUrl(
  '/pickup-delivery/promo-code/verify',
);

export const GET_ALL_SUBSCRIPTION_PLANS = getApiUrl('/user/subscription/plans');
export const SELECT_SPECIFIC_PLAN = getApiUrl('/user/subscription/selectPlan');
export const PURCHASE_SPECIFIC_PLAN = getApiUrl('/user/subscription/purchase');
export const CANCEL_SPECIFIC_PLAN = getApiUrl('/user/subscription/cancel');
// export const RENEW_SPECIFIC_PLAN = getApiUrl('/user/subscription/cancel');

export const GET_LOYALTY_INFO = getApiUrl('/user/loyalty/info');
export const GET_RETURN_ORDER_DETAIL = getApiUrl(
  '/return-order/get-order-data-in-model',
);
export const GET_RETURN_PRODUCT_DETAIL = getApiUrl(
  '/return-order/get-return-products',
);

export const UPLOAD_PRODUCT_IMAGE = getApiUrl('/upload-file');

export const SUBMIT_RETURN_ORDER = getApiUrl(
  '/return-order/update-product-return',
);

export const VENDOR_TABLE_CART = getApiUrl('/add/vendorTable/cart');

export const SCHEDULE_ORDER = getApiUrl('/cart/schedule/update');
export const MY_PENDING_ORDERS = getApiUrl('/my_pending_orders');
export const DISPATCHER_URL = getApiUrl(
  '/pickup-delivery/order-tracking-details',
);
export const CART_PRODUCT_SCHEDULE = getApiUrl('/cart/product-schedule/update');
export const TIP_AFTER_ORDER = getApiUrl('/orders/tip-after-order');
export const REMOVE_PROFILE_IMAGE = getApiUrl('/remove/image');
export const STRIPE_INTENT = getApiUrl('/stripe/intent');
export const UPDATE_STRIPE_PAID_STATUS = getApiUrl('/cart/update-paid');
export const USE_WALLET=getApiUrl('/cart/toggle-use-wallet');
export const ADD_TIP=getApiUrl('/cart/update-tip-amount');
export const ORDER_RECEIPT=getApiUrl('/order/invoice');
export const USE_WALLET_FOR_DELIVERY=getApiUrl('/pickup-delivery/toggle-wallet');
export const REMOVE_DELIVERY_PROMO_CODE = getApiUrl('/pickup-delivery/promo-code/remove');
export const CREATE_DELIVERY_CART = getApiUrl('/pickup-delivery/create-cart');
export const UPDATE_STRIPE_PAID_STATUS_DELIVERY = getApiUrl('/pickup-delivery/update-paid');
export const CREATE_DELIVERY_CART_STRIPE_INTENT = getApiUrl('/pickup-delivery/stripe-intent');
export const ADD_SPECIAL_INSTRUCTIONS = getApiUrl('/cart/update-special-instruction');
