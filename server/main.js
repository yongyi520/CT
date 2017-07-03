import '/imports/startup/server/index.js';

import { geminiBuySellAlgorithm } from '/imports/api/gemini/algorithm/algorithm.js';
import { geminiCancelOrderCollectionCleanupTask } from '/imports/api/gemini/algorithm/clean-up.js';
import { getAlgorithmSettings, setAlgorithm } from '/imports/api/algorithm/algorithm-settings.js';


Meteor.startup(function(){
    // console.log("algorithm setting", getAlgorithmSettings());
    // geminiBuySellAlgorithm();
    // geminiCancelOrderCollectionCleanupTask();
    // SyncedCron.start();
})