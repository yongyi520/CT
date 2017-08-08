// import React from 'react';
// import { render } from 'react-dom';
// import {
//     BrowserRouter as Router,
//     Route,
//     Link
// } from 'react-router-dom'

import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'

import App from '/imports/ui/App.jsx';

import ExchangeTest from '/imports/ui/components/ExchangeAPI.jsx';


Meteor.startup(() => {
    render(
       <App/>,
        document.getElementById('render-target'));
});