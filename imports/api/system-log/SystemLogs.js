export const SystemLogs = new Meteor.Collection('SystemLogs');

SystemLogSchema = new SimpleSchema({
    exchange: {
        type: String,
        optional: true
    },
    algorithm_type: {
        type: String,
        optional: true
    },
    algorithm_interval: {
        type: String,
        optional: true
    },
    symbol: {
        type: String,
        optional: true
    },
    message: {
        type: String
    }
});

SystemLogs.attachSchema(SystemLogSchema);