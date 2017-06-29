import { newOrder } from '/imports/api/gemini/restAPI.js';
import { getGeminiLastHourlyPriceRange } from '/imports/api/price-tracker/hourly-price.js';
import { GeminiOrders } from '/imports/api/gemini/collections/geminiOrders.js';
import { buySellCriteria } from '/imports/api/gemini/algorithm/algorithmCriteria.js';
import { insertSystemLog } from '/imports/api/system-log/systemLogsHelpers.js';

import Future from 'fibers/future';

// get last hourly price algorithm
export const newGeminiOrders = () => {
    getGeminiLastHourlyPriceRange()
        .then(response => {
            return createNewGeminiBuyOrders(response);
        })
}

const createNewGeminiBuyOrders = (response) => {
    var low = response.data.Data[0].low;
    // var low = 100;
    console.log("last hour's low", low);
    buySellCriteria.forEach( criteria => {
        // console.log("criteria", criteria);
        setTimeout(()=>{
            buyGeminiOrder(criteria, low)
        }, criteria.level * 1000)

    } )
}

const buyGeminiOrder = function(orderCriteria, lastHourLow) {
    console.log("inside buy gemini order", orderCriteria);
    var buyPrice = (lastHourLow * orderCriteria.buyPricePercentage).toFixed(2);
    // console.log("buy percentage", orderCriteria.buyPricePercentage, "buy price", buyPrice)

    var params = {
        symbol: 'ethusd',
        side: 'buy',
        amount: orderCriteria.buySellAmount,
        price: buyPrice,
        type: 'exchange limit'
    };
    // console.log("params", params);
    var newOrderCallback = Meteor.bindEnvironment((response) => {
        console.log("new buy order placed from algorithm");
        console.log(response);
        var message = "new buy order created { price: " + response.price + ", amount: " + response.original_amount + " }";
        insertSystemLog(message);
        var geminiOrderInfo = {
            order_id: parseInt(response.order_id),
            symbol: response.symbol,
            order_type: response.side,
            status: 'active',
            price: parseFloat(response.price),
            amount: parseFloat(response.original_amount),
            order_pair: parseInt(response.order_id),
            algorithm_type: 'buy-low-sell-high',
            buy_percent: orderCriteria.buyPricePercentage,
            sell_percent: orderCriteria.sellPricePercentage
        }
        // console.log("saving gemini algorithm buy order info", geminiOrderInfo);
        GeminiOrders.insert(geminiOrderInfo, (error, id) => {
            if(error)
                console.log("error", error);
            else
                console.log("successful insert order data, id: ", id);
        });
    });
    var errorHandler = Meteor.bindEnvironment(error => {
        console.log("error buying order", error);
        if(error.reason == 'InvalidNonce' || error.reason == 'RateLimit'){
            console.log("nounce or rate limit error, calling it again in 5 seconds");
            setTimeout(() => {
                newOrder(params).then(newOrderCallback).catch(errorHandler)
            }, 5000);
        }

    });
    newOrder(params).then(newOrderCallback).catch(errorHandler);
}.future()