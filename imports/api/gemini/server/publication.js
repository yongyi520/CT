import { GeminiOrders } from '/imports/api/gemini/collections/geminiOrders.js';

Meteor.publish('GeminiOrders', function() {
    return GeminiOrders.find();
})