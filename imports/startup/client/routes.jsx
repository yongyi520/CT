import React from 'react';
import { render } from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'
import App from '/imports/ui/App.jsx';

import ExchangeTest from '/imports/ui/components/ExchangeAPI.jsx';

Meteor.startup(() => {
    render(
    <Router>
        <Route exact path="/" component={App}></Route>

    </Router>,
        document.getElementById('render-target'));
});
