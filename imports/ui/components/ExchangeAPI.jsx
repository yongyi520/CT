import React, {Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { GeminiOrders } from '/imports/api/gemini/collections/geminiOrders.js';
import { SystemLogs } from '/imports/api/system-log/SystemLogs.js';

require('./ExchangeAPI.sass');

class ExchangeAPI extends Component {

    constructor(){
        super();
        this.state = {
            exchange: "gemini",
            algorithmOn: true
        }
        Meteor.subscribe('GeminiOrders');
    }

    getAllSymbols(){
        Meteor.call('gemini.getAllSymbols');
    }

    websocketOrder(){
        Meteor.call('gemini.openOrderSocket');
    }

    lastHourlyPriceRange(){
        Meteor.call('getGeminiLastHourlyPriceRange');
    }

    buyOrder(e){
        e.preventDefault();
        var params = {
            symbol: this.refs.buyOrderCurrency.value,
            side: 'buy',
            amount: parseFloat(this.refs.buyOrderAmount.value),
            price: parseFloat(this.refs.buyOrderPrice.value),
            type: 'exchange limit'
        };
        console.log("buy order params", params);
        Meteor.call('gemini.newOrder', params);
    }

    sellOrder(e){
        e.preventDefault();
        var params = {
            symbol: this.refs.sellOrderCurrency.value,
            side: 'sell',
            amount: parseFloat(this.refs.sellOrderAmount.value),
            price: parseFloat(this.refs.sellOrderPrice.value),
            type: 'exchange limit'
        };
        console.log("sell order params", params);
        Meteor.call('gemini.newOrder', params);
    }

    cancelOrder(e){
        e.preventDefault();
        var orderId = parseInt(this.refs.cancelOrderId.value);
        Meteor.call('gemini.cancelOrder', orderId);
    }

    cancelAllOrders(e){
        e.preventDefault();
        Meteor.call('gemini.cancelAllActiveOrders');
    }

    orderCollection(){
        var geminiOrders = GeminiOrders.find().fetch();
        console.log("gemini orders", geminiOrders);
    }

    buySellAlgorithm(){
        Meteor.call('geminiBuySellAlgorithm');
    }

    resetCollection(){
        Meteor.call('resetCollections');
    }

    activeOrders(){
        Meteor.call('gemini.activeOrders');
    }

    lastThirtyMinutePriceRange(){
        Meteor.call('getGeminiThirtyMinutePriceRange');
    }

    turnAlgorithmOn(){
        Meteor.call('setGeminiAlgorithmOn');
    }

    turnAlgorithmOff(){
        Meteor.call('setGeminiAlgorithmOff');
    }

    checkAlgorithmStatus(){
        Meteor.call('getGeminiBuyLowSellHighHourlySetting', (error, status) => {
            if(status)
                alert('algorithm is on')
            else
                alert('algorithm is off')
        })
    }

    render(){
        console.log("system log", this.props.logs)
        return(
            <div>
                <div className="algorithm">
                    <h2>Algorithm (ON / OFF)</h2>
                    <button onClick={() => this.checkAlgorithmStatus()}>Check Status</button>
                    <button onClick={() => this.turnAlgorithmOn()}>ON</button>
                    <button onClick={() => this.turnAlgorithmOff()}>OFF</button>
                </div>
                <div className="system-log">
                    { this.props.logs.map( log => {
                        return <p key={log._id}>{log.message}</p>
                    })

                    }
                </div>
                <div className="websockets">
                    <h2>Websockets</h2>
                    <button onClick={() => this.websocketOrder()}>orders</button>
                    <button onClick={() => {}}></button>
                </div>
                <div className="rest">
                    <div className="title">
                        <h2>REST</h2>
                    </div>
                    <div className="content">
                        <form className="mini-form">
                            <div className="form-group">Buying Order</div>
                            <div className="form-group">
                                <label>Currency Pair</label>
                                <select ref="buyOrderCurrency" value="ethusd" className="form-control">
                                    <option value="ethusd">ETH-USD</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Price</label>
                                <input ref="buyOrderPrice" className="form-control" type="number"/>
                            </div>
                            <div className="form-group">
                                <label>Amount</label>
                                <input ref="buyOrderAmount" className="form-control" type="number"/>
                            </div>
                            <div className="form-group">
                                <label>Total</label>
                                <input ref="buyOrderTotal" className="form-control" type="number"/>
                            </div>
                            <button onClick={(e) => this.buyOrder(e)} className="btn btn-default" type="submit">Buy Order</button>
                        </form>

                        <form className="mini-form">
                            <div className="form-group">Selling Order</div>
                            <div className="form-group">
                                <label>Currency Pair</label>
                                <select ref="sellOrderCurrency" value="ethusd" className="form-control">
                                    <option value="ethusd">ETH-USD</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Price</label>
                                <input ref="sellOrderPrice" className="form-control" type="number"/>
                            </div>
                            <div className="form-group">
                                <label>Amount</label>
                                <input ref="sellOrderAmount" className="form-control" type="number"/>
                            </div>
                            <div className="form-group">
                                <label>Total</label>
                                <input ref="sellOrderTotal" className="form-control" type="number"/>
                            </div>
                            <button onClick={(e) => this.sellOrder(e)} className="btn btn-default" type="submit">Sell Order</button>
                        </form>

                        <form className="mini-form">
                            <div className="form-group">Cancelling Orders</div>
                            <div className="form-group">
                                <label>Order Id</label>
                                <input ref="cancelOrderId" className="form-control" type="number"/>
                            </div>
                            <button onClick={(e) => this.cancelOrder(e)}>Cancel Order</button>
                            <hr/>
                            <div className="form-group">Cancelling All Orders</div>
                            <button onClick={() => this.cancelAllOrders()}>Cancel All Orders</button>
                        </form>
                    </div>
                    <div className="content">
                        <div className="mini-form">
                            <button onClick={(e) => this.activeOrders(e)}>Gemini Active Orders</button>
                            <button onClick={(e) => this.cancelAllOrders(e)}> Gemini Cancel All Orders </button>
                        </div>
                    </div>

                </div>
                <div className="order-collection">
                    <h2>Order Collections</h2>
                    <button onClick={(e) => this.orderCollection(e)}>Gemini Order Data</button>
                    <button onClick={(e) => this.resetCollection(e)}>Gemini Reset Order Data</button>
                </div>
                <div className="algorithm">
                    <h2>Algorithm</h2>
                    <button onClick={() => this.lastHourlyPriceRange()}>Get Last Hourly Price Range</button>
                    <button onClick={() => this.lastThirtyMinutePriceRange()}>Get Last Thirty Minute Price Range </button>
                    <button onClick={() => this.buySellAlgorithm()}>Buy Sell Algorithm</button>
                </div>

            </div>
        )
    }
}

export default ExchangeAPIContainer = createContainer( () => {
    const subscription = Meteor.subscribe("SystemLogs");
    const loading = !subscription.ready();
    const logExist = !loading;
    const logs = logExist ? SystemLogs.find().fetch() : [];
    return {
        loading: loading,
        logs: logs
    }
}, ExchangeAPI );