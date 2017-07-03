import { getAllSymbols, getMyAvailableBalances, newOrder, cancelOrder,
            cancelAllSessionOrders, cancelAllActiveOrders, getMyOrderStatus, getMyActiveOrders} from '/imports/api/gemini/restAPI.js';

import { getWebsocketClient, openMarketSocket, openOrderSocket } from '/imports/api/gemini/websocketAPI.js';

// price range
import { getGeminiLastHourlyPriceRange } from '/imports/api/gemini/algorithm/gemini-price-tracker/gemini-price-tracker.js';
import { getGeminiLastThirtyMinutePriceRange } from '/imports/api/price-tracker/thirty-minute-price.js';

import { GeminiOrders } from '/imports/api/gemini/collections/geminiOrders.js';

import { geminiBuySellAlgorithm } from '/imports/api/gemini/algorithm/algorithm.js';

import Future from 'fibers/future';

import { socketOrderListener, getLastHeartbeat } from '/imports/api/gemini/algorithm/buy-sell-algorithm/order-listener.js';

// algorithm methods
Meteor.methods({
    geminiBuySellAlgorithm: function(){
        console.log("initiating gemini buy sell algorithm");
        geminiBuySellAlgorithm();
    }
})

// rest api methods
Meteor.methods({
    'gemini.getAllSymbols': function(){
        getAllSymbols().then((response)=>{
            console.log("get all symbols", response);
        })
    },
    'gemini.activeOrders': function() {
        getMyActiveOrders().then(response => {
            // console.log("gemini active order", response);
            response.forEach( order => {
                console.log("each order", order);
                console.log("finding order in database", GeminiOrders.findOne({order_id: parseInt(order.order_id), order_type: order.side, algorithm_type: 'buy-low-sell-high'}));
                if (GeminiOrders.findOne({order_id: parseInt(order.order_id), order_type: order.side, algorithm_type: 'buy-low-sell-high'})){
                    console.log("buy order matched database");
                    cancelOrder(order.order_id).then( response => {
                        console.log("cancelling last hour's order");
                        console.log("updating order database");
                        GeminiOrders.update({order_id: parseInt(response.order_id), order_type: response.side, algorithm_type: 'buy-low-sell-high'}, {$set: {status: 'cancelled'}});
                    })
                }
            })
        })
    },
    'gemini.getMyAvailableBalances': function(){
        getMyAvailableBalances().then((response)=>{
            console.log("get my available balance", response);
        })
    },
    'gemini.newOrder': function(params){
        newOrder(params).then((response) => {
            console.log("new order placed");
            console.log(response);
            var geminiOrderInfo = {
                order_id: parseInt(response.order_id),
                symbol: response.symbol,
                order_type: response.side,
                status: 'active',
                price: parseFloat(response.price),
                amount: parseFloat(response.original_amount),
                order_pair: parseInt(response.order_id),
                algorithm_type: 'buy-low-sell-high',
                buy_percent: 0.02,
                sell_percent: 0.14
            }
            console.log("gemini order info", geminiOrderInfo);
            GeminiOrders.insert(geminiOrderInfo, (error, id) => {
                if(error)
                    console.log("error", error);
                else
                    console.log("successful insert order data, id: ", id);
            });
        });
    },
    'gemini.cancelOrder': function(orderId){
        console.log('cancelling order', orderId);
        cancelOrder(orderId).then((response) => {
            console.log(response);
            var orderId = parseInt(response.order_id);
            GeminiOrders.update({order_id: orderId}, {$set: {status: 'cancelled'}})
        }).catch(error => {
            console.log("error");
            console.log(error);
        });
    },
    'gemini.cancelAllActiveOrders': function(){
        console.log("cancelling all orders");
        cancelAllActiveOrders().then( response => {
            console.log(response);
        })
    }
})

// collections
Meteor.methods({
  'orderCollections': function() {
      console.log("orders collection", GeminiOrders.find().fetch());
  },
    'resetCollections': function(){
      GeminiOrders.remove({});
    },
    'removeActiveOrders': function(){
        GeminiOrders.remove({status: 'cancelled'});
    }
})

const updateGeminiOrder = function(order_id, fieldObject) {
    GeminiOrders.update({order_id: order_id}, {$set: fieldObject})
}.future();

const getGeminiOrder = (order_id) => {
    return GeminiOrders.findOne({order_id: order_id, order_type: 'buy'});
}

const executeSellOrder = function(order_id) {
    var geminiOrder = getGeminiOrder(order_id);
    console.log("gemini buy order from database", geminiOrder);
    var amount = geminiOrder.amount;
    var price = (geminiOrder.price * geminiOrder.sell_percent).toFixed(2);
    var params = {
        symbol: 'ethusd',
        side: 'sell',
        amount: amount,
        price: price,
        type: 'exchange limit'
    };
    console.log("sell order params", params);

    newOrder(params).then((response) => {
        console.log("new sell order after a buy order is filled");
        console.log(response);
        var geminiOrderInfo = {
            order_id: parseInt(response.order_id),
            symbol: response.symbol,
            order_type: response.side,
            status: 'active',
            price: parseFloat(response.price),
            amount: parseFloat(response.original_amount),
            order_pair: geminiOrder.order_pair,
            algorithm_type: 'buy-low-sell-high',
            buy_percent: geminiOrder.buy_percent,
            sell_percent: geminiOrder.sell_percent
        }
        console.log("save gemini sell order info", geminiOrderInfo);
        GeminiOrders.insert(geminiOrderInfo, (error, id) => {
            if(error)
                console.log("error", error);
            else
                console.log("successful insert order data, id: ", id);
        });
    });
}.future()


// websocket methods
Meteor.methods({
    'gemini.websocketInterval': function(){
        var lastHeartbeat = getLastHeartbeat();
        var now = moment();
        console.log("last heartbeat", lastHeartbeat);
        var interval = now.diff(lastHeartbeat);
        console.log("differences between now and last heartbeat", interval)
    },
    'gemini.openMarketSocket': function(){
        openMarketSocket('ethusd', () => {
            websocketClient.addMarketMessageListener( data => {
                console.log("data", data);
            })
        })
    },
    'gemini.openOrderSocket': ()=>{
        socketOrderListener();
    }
})

// previous hour data
Meteor.methods({
    getGeminiLastHourlyPriceRange: function(){
        getGeminiLastHourlyPriceRange('ethusd').then(function(response){
            console.log("price range for gemini");
            console.log(response.data);
        })
    },
    getGeminiThirtyMinutePriceRange: function(){
        getGeminiLastThirtyMinutePriceRange().then(function(response){
            // console.log("last 40 minutes of graph", response.data);
            console.log("data received");
            var now = moment();
            now.set('second', 0);
            now.set('millisecond', 0)
            var minute = now.minute();
            if(minute >= 30){
                now.set('minute', 30);
            } else {
                now.subtract(minute, 'minute');
            }

            var to = now.clone().subtract(1, 'minute');
            var from = to.clone().subtract(29, 'minute');
            console.log("from: ", from, ", in epoch time", from.unix());
            console.log("to: ", to, ", in epoch time", to.unix());

        })
    }
})
