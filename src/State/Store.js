import {createStore, applyMiddleware} from 'redux';
import Reducers from './Reducers';
import thunk from 'redux-thunk';

const Store = createStore(Reducers, applyMiddleware(thunk));

export default Store;
