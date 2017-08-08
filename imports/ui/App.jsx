import React, {Component} from 'react';

import { BrowserRouter, Route, Link } from 'react-router-dom';

import ExchangeTest from '/imports/ui/components/ExchangeAPI.jsx';
import Home from '/imports/ui/components/home/Home.jsx';

export default class App extends Component {
    render(){
        return(
            <BrowserRouter>
                <div className="app">
                    <Route exact path="/" component={ExchangeTest}/>
                    <Route path="/home" component={Home}/>
                </div>
            </BrowserRouter>
        )
    }
}
