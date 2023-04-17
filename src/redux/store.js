import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
const middlewares = [thunk];
import { composeWithDevTools } from 'redux-devtools-extension';

export default createStore(reducer,  composeWithDevTools(
    applyMiddleware(...middlewares)
    // other store enhancers if any
  ));
