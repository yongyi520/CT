import { SystemLogs } from '/imports/api/system-log/SystemLogs.js';

import Future from 'fibers/future';

export const insertSystemLog = function(message){
    SystemLogs.insert({message: message});
}.future()

export const resetSystemLog = function(){
    SystemLogs.remove({});
}