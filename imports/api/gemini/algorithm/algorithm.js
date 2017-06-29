
// buy-sell-algorithm
import { socketOrderListener, getLastHeartbeat } from '/imports/api/gemini/algorithm/buy-sell-algorithm/order-listener.js';
import { newGeminiOrders } from '/imports/api/gemini/algorithm/buy-sell-algorithm/calculate-and-create-new-gemini-orders.js'
import { cancelLastHourBuyOrders } from '/imports/api/gemini/algorithm/buy-sell-algorithm/cancel-last-hour-buy-orders.js';

import { restartWebsocketClient } from '/imports/api/gemini/websocketAPI.js';

import { getAlgorithmSettings } from '/imports/api/algorithm/algorithm-settings.js';

import { insertSystemLog, resetSystemLog } from '/imports/api/system-log/systemLogsHelpers.js';

import moment from 'moment-timezone'

export const geminiBuySellAlgorithm = () => {
    socketOrderListener();
    // set this up with synced cron so it runs every hour
    // cancel last hour's buy orders
    // synced cron task
    SyncedCron.add({
        name: 'gemini.keepOrderListenerAlive',
        schedule: function(parser){
            return parser.text('every 30 minutes')
        },
        job: function(){
            if(getAlgorithmSettings().gemini.buyLowSellHigh.hourly){
                var lastHeartbeat = getLastHeartbeat();
                var now = moment();
                var interval = now.diff(lastHeartbeat);
                console.log("differences between now and last heartbeat", interval)
                if(interval > 5000){
                    console.log("restarting websocket client");
                    restartWebsocketClient();
                    console.log("order listener on in 10 seconds");
                    setTimeout(() => {
                        socketOrderListener()
                    }, 10000)
                }
            }
        }
    });
    SyncedCron.add({
        name: 'gemini.buy-low-sell-high',
        schedule: function(parser){
            return parser.recur().on(3).minute();
            // return parser.text('every 5 minutes')
        },
        job: function(){
            console.log("executing buy-low-sell-high algorithm")
            resetSystemLog();
            var myTime = moment().tz("Asia/Bangkok").format();
            insertSystemLog("----- " + myTime + "-----");
            insertSystemLog('executing buy-low-sell-high algorithm');
            if(getAlgorithmSettings().gemini.buyLowSellHigh.hourly){
                insertSystemLog("cancelling last hour's buy low sell high orders");
                cancelLastHourBuyOrders();
                // console.log("wait for 10 seconds");
                insertSystemLog("creating new buy orders for buy low sell high algorithm");
                setTimeout(newGeminiOrders, 10000);
            }
        }
    })

    // cancelLastHourBuyOrders();
    // newGeminiOrders();

}

