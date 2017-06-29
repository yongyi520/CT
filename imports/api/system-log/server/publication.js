import { SystemLogs } from '/imports/api/system-log/SystemLogs.js';

Meteor.publish('SystemLogs', function() {
    return SystemLogs.find();
})