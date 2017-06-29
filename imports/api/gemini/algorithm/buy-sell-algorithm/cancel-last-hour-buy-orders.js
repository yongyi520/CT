import { getMyActiveOrders, cancelOrder } from '/imports/api/gemini/restAPI.js';
import { GeminiOrders } from '/imports/api/gemini/collections/geminiOrders.js';
import Future from 'fibers/future';

export const cancelLastHourBuyOrders = function() {
    getMyActiveOrders().then(response => {
        // console.log("gemini active order", response);
        response.forEach( order => {
            // console.log("each order", order);
            // console.log("finding order in database", GeminiOrders.findOne({order_id: parseInt(order.order_id), order_type: order.side, algorithm_type: 'buy-low-sell-high'}));
            if (GeminiOrders.findOne({order_id: parseInt(order.order_id), order_type: 'buy', algorithm_type: 'buy-low-sell-high'})){
                console.log("buy order_id: ", order.order_id, " matched database");
                var cancelOrderCallback = Meteor.bindEnvironment(response => {
                    console.log("cancelling last hour's order");
                    console.log("updating order database");
                    GeminiOrders.update({order_id: parseInt(response.order_id), order_type: 'buy', algorithm_type: 'buy-low-sell-high'}, {$set: {status: 'cancelled'}});
                });
                var cancelOrderErrorHandler = Meteor.bindEnvironment(error => {
                    console.log("error cancelling order", error);
                    if(error.reason == 'InvalidNonce' || error.reason == 'RateLimit'){
                        console.log("nounce or rate limit error, calling it again in 5 seconds");
                        setTimeout(() => {
                            cancelOrder(order.order_id).then(cancelOrderCallback).catch(cancelOrderErrorHandler)
                        }, 5000);
                    }

                })
                cancelOrder(order.order_id).then(cancelOrderCallback).catch(cancelOrderErrorHandler);
            }
        })
    })
}.future()