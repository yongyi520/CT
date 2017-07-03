import axios from 'axios';

export const getCryptoPrice = function(interval, exchange, symbol, limit=1){
    var string = 'https://min-api.cryptocompare.com/data/' +
        interval + '?' +
        'fsym=' + symbol.from + '&' +
        'tsym=' + symbol.to + '&' +
        'e=' + exchange + '&' +
        'limit=' + limit.toString();
    console.log("call crypto price string", string);
    return axios.get(string);
}
