import React, {Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { GeminiOrders } from '/imports/api/gemini/collections/geminiOrders.js';
import { SystemLogs } from '/imports/api/system-log/SystemLogs.js';

import { compose } from 'react-komposer';

import '/imports/ui/components/home/Home.sass';

class Home extends Component {
    render(){
        return (
            <div id="home">
                <div className="header">
                    <div className="left">

                    </div>
                    <div className="right">

                    </div>
                </div>
                <div className="content-wrapper">
                    <div className="content">
                        <div className="main-content">
                            <div className="side-menu">

                            </div>
                            <div className="content">

                            </div>
                        </div>
                        <div className="side-content">
                            <div className="top-menu">

                            </div>
                            <div className="content">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function getTrackerLoader(reactiveMapper){
    return (props, onData, env) => {
        let trackerCleanup = null;
        const handler = Tracker.nonreactive(() => {
            return Tracker.autorun(() => {
                // assign cleanup function
                trackerCleanup = reactiveMapper(props, onData, env);
            })
        })
    }
}

// usage
function reactiveMapper(props, onData){
    if(Meteor.subscribe('SystemLogs').ready()){
        const logs = SystemLogs.find().fetch();
        onData(null, {logs});
    }
}

export default ExchangeAPIContainer = compose(getTrackerLoader(reactiveMapper))(Home);