import { GeminiOrders } from '/imports/api/gemini/collections/geminiOrders.js';

export const geminiCancelOrderCollectionCleanupTask = function(){
    SyncedCron.add({
        name: 'geminiCancelOrderCollectionCleanup',
        schedule: function(parser){
            // return parser.recur().on(1).minute();
            return parser.text('every 6 hours')
        },
        job: function(){
            console.log("delete gemini cancelled order fromm collection")
            GeminiOrders.remove({status: 'cancelled'});
        }
    })
}