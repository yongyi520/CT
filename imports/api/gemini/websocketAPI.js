import { GeminiAPIWebsocketClient } from '/imports/api/gemini/lib/websocketClient.js';

// var key = Meteor.settings.gemini.key;
// var secret = Meteor.settings.gemini.secret;
//
// var websocketClient = new GeminiAPIWebsocketClient({ key, secret, sandbox: false })

var key = Meteor.settings.geminiSandBox.key;
var secret = Meteor.settings.geminiSandBox.secret;

var websocketClient = new GeminiAPIWebsocketClient({ key, secret, sandbox: true });

export const getWebsocketClient = function(){
    return websocketClient;
}

export const restartWebsocketClient = function(){
    websocketClient = new GeminiAPIWebsocketClient({ key, secret, sandbox: false });
}

export const openMarketSocket = function(symbol, onOpen){
    return websocketClient.openMarketSocket(symbol, onOpen);
}

export const openOrderSocket = function(onOpen){
    return websocketClient.openOrderSocket(onOpen);
}
export const addMarketMessageListener = function(listener){

}

export const addOrderMessageListener = function(listener){

}

export const removeMarketMessageListener = function(listener){

}

export const removeOrderMessageListener = function(listener){

}

export const addMarketListener = function(event, listener){

}

export const addOrderListener = function(event, listener){

}

export const removeMarketListener = function(event, listener){

}

export const removeOrderListener = function(event, listener){

}