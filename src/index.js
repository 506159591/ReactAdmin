import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from "react-redux";
import store from './redux/store'



ReactDOM.render(
  //包裹Provider,将store放在context中
  <Provider store={store}>
    <App/>
  </Provider>, 
  document.getElementById('root')
  )
