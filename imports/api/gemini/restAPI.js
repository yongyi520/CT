import { GeminiAPI } from '/imports/api/gemini/lib/geminiRestAPI.js';

//
// var key = Meteor.settings.gemini.key;
// var secret = Meteor.settings.gemini.secret;
//
// const restClient = new GeminiAPI({ key, secret, sandbox: false });

var key = Meteor.settings.geminiSandBox.key;
var secret = Meteor.settings.geminiSandBox.secret;

const restClient = new GeminiAPI({ key, secret, sandbox: true });

export const getAllSymbols = function(){
    return restClient.getAllSymbols();
}

export const getTicker = function(symbol){

}


export const getOrderBook = function(symbol, params = {}){

}

export const getTradeHistory = function(symbol, params = {}){

}

export const getCurrentAuction = function(symbol){

}

export const getAuctionHistory = function(symbol, params = {}){

}

export const newOrder = function(params = {}){
    return restClient.newOrder(params);
}

export const cancelOrder = function(order_id){
    return restClient.cancelOrder({ order_id});
}

export const cancelAllSessionOrders = function(){

}

export const cancelAllActiveOrders = function(){
    return restClient.cancelAllActiveOrders();
}

export const getMyOrderStatus = function({ order_id }){

}

export const getMyActiveOrders = function(){
    return restClient.getMyActiveOrders();
}

export const getMyPastTrades = function(params = {}){

}

export const getMyTradeVolume = function(){

}

export const getMyAvailableBalances = function(){
    return restClient.getMyAvailableBalances();
}
