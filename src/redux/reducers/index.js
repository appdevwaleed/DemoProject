import {combineReducers} from 'redux';
import types from '../types';
import appTheme from './appTheme';
import auth from './auth';
import cart from './cart';
import home from './home';
import initBoot from './initBoot';
import product from './product';
import vendor from './vendor';
import pickupdelivery from './pickupdelivery';
import order from './order';
import pendingNotifications from './pendingNotifications';
const appReducer = combineReducers({
  auth,
  appTheme,
  initBoot,
  home,
  vendor,
  product,
  cart,
  pickupdelivery,
  order,
  pendingNotifications
});

const rootReducer = (state, action) => {
  if (action.type == types.CLEAR_REDUX_STATE) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
