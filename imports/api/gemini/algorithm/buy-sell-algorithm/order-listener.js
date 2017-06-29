import { newOrder } from '/imports/api/gemini/restAPI.js';
import { getWebsocketClient, openOrderSocket } from '/imports/api/gemini/websocketAPI.js';
import { GeminiOrders } from '/imports/api/gemini/collections/geminiOrders.js';
import { getAlgorithmSettings } from '/imports/api/algorithm/algorithm-settings.js';
import { insertSystemLog } from '/imports/api/system-log/systemLogsHelpers.js';

import Future from 'fibers/future';

var lastHeartBeat = null;

export const getLastHeartbeat = () => {
    return lastHeartBeat;
}

// order listener
export const socketOrderListener = () => {
    openOrderSocket(() => {
        getWebsocketClient().addOrderMessageListener( data => {
            if(data.type == 'heartbeat'){
                // console.log("saving heartbeat time");
                lastHeartBeat = moment();
                // console.log(lastHeartBeat)
            }
            _.forEach(data, orderEvent => {
                if(orderEvent.type == 'cancelled'){
                    console.log("order cancelled");
                    console.log(orderEvent.order_id)
                } else if(orderEvent.type == 'initial'){
                    // console.log("initial");
                } else if (orderEvent.type == 'fill'){
                    console.log("order filled");

                    console.log(orderEvent.order_id);
                    if(getAlgorithmSettings().gemini.buyLowSellHigh.hourly){
                        if(orderEvent.side == 'buy' && orderEvent.remaining_amount == '0'){
                            console.log("buy order filled, execute sell order");
                            insertSystemLog("buy order filled: { price: ", orderEvent.price, ", amount: ", orderEvent.original_amount, " }");
                            insertSystemLog("create sell order");
                            updateGeminiOrder(parseInt(orderEvent.order_id), {status: 'filled'});
                            executeSellOrder(parseInt(orderEvent.order_id));
                        }
                        if(orderEvent.side == 'sell' && orderEvent.remaining_amount == '0'){
                            console.log("sell order filled, update sell order database");
                            insertSystemLog("sell order filled: { price: ", orderEvent.price, ", amount: ", orderEvent.original_amount, " }");
                            insertSystemLog("update database");
                            updateGeminiOrder(parseInt(orderEvent.order_id), {status: 'filled'});
                        }
                    }
                }


            })
        })
    })
}

const buyOrderFilledSystemLog = function(orderEvent){
    insertSystemLog("buy order filled: { price: ", orderEvent.price, ", amount: ", orderEvent.original_amount, " }");
    insertSystemLog("create sell order");
}.future();

const sellOrderFilledSystemLog = function(orderEvent){
    insertSystemLog("sell order filled: { price: ", orderEvent.price, ", amount: ", orderEvent.original_amount, " }");
    insertSystemLog("update database");
}.future()

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


    var sellOrderCallBack = Meteor.bindEnvironment((response) => {
        console.log("new sell order after a buy order is filled");
        console.log(response);
        insertSystemLog("new sell order created { price: " + response.price + ", amount: " + response.original_amount + " }");
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
    var sellOrderErrorHandler = Meteor.bindEnvironment(error => {
        console.log("error buying order", error);
        if(error.reason == 'InvalidNonce' || error.reason == 'RateLimit'){
            console.log("nounce or rate limit error, calling it again in 5 seconds");
            setTimeout(() => {
                newOrder(params).then(sellOrderCallBack).catch(sellOrderErrorHandler)
            }, 5000);
        }

    });

    newOrder(params).then(sellOrderCallBack).catch(sellOrderErrorHandler);
}.future()

