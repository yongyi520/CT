export const GeminiOrders = new Meteor.Collection('GeminiOrders');

GeminiOrdersSchema = new SimpleSchema({
    order_id: {
        type: Number
    },
    order_type: {
        type: String
    },
    order_pair: {
        type: Number
    },
    symbol: {
        type: String
    },
    status: {
        type: String
    },
    price: {
        type: Number,
        decimal: true
    },
    amount: {
        type: Number,
        decimal: true
    },
    algorithm_type: {
        type: String,
        optional: true
    },
    algorithm_interval: {
        type: String,
        optional: true
    },
    buy_percent: {
        type: Number,
        decimal: true,
        optional: true
    },
    sell_percent: {
        type: Number,
        decimal: true,
        optional: true
    }
});

GeminiOrders.attachSchema(GeminiOrdersSchema);