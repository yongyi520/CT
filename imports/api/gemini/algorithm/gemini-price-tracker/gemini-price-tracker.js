import { intervals, exchanges, symbols } from '/imports/api/price-tracker/crypto-compare-constants.js';
import { getCryptoPrice } from '/imports/api/price-tracker/getCryptoPriceData.js';

export const getGeminiLastHourlyPriceRange = function(symbol){
    return getCryptoPrice(intervals.hour, exchanges.gemini, symbols[symbol]);
}

export const getGeminiLastDailyPriceRange = function(symbol){
    return getCryptoPrice((intervals.day, exchanges.gemini, symbols[symbol]))
}

export const getGemini30MinutePriceRange = function(){

}