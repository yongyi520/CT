import { getAlgorithmSettings, setAlgorithm } from '/imports/api/algorithm/algorithm-settings.js';
import { SystemLogs } from '/imports/api/system-log/SystemLogs.js';



Meteor.methods({
    getAlgorithmSettings: function(){
        console.log("get algorithm settings", getAlgorithmSettings())
    },
    getGeminiBuyLowSellHighHourlySetting: function(){
      return getAlgorithmSettings().gemini.buyLowSellHigh.hourly;
    },
    setGeminiAlgorithmOff: function(){
        setAlgorithm('gemini', 'buyLowSellHigh', 'hourly', false);
    },
    setGeminiAlgorithmOn: function(){
        setAlgorithm('gemini', 'buyLowSellHigh', 'hourly', true);
    },
    getSystemLogs: function(){
        console.log("system logs", SystemLogs.find().fetch())
    }
})