import {createStore, applyMiddleware} from 'redux'
import reducer from './reducer'
import thunk from 'redux-thunk'
import { composeWithDevTools } from "redux-devtools-extension";
//创建store传入reducer，允许使用异步action，devtools
export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))
