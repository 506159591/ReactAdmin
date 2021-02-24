import React, { Component } from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import Detail from "./detail";
import Home from "./home";
import AddUpdate from "./addupdate";
import './index.less'

export default class Product extends Component {
    render() {
        
        return (
            <div>
                <Switch>
                    <Route path='/product' component={Home} exact/>
                    <Route path='/product/detail' component={Detail}/>
                    <Route path='/product/addupdate' component={AddUpdate}/>
                    <Redirect to='/product'/>
                </Switch>
            </div>
        )
    }
}
