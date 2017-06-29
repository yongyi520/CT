import axios from 'axios';

export const getGeminiLastHourlyPriceRange = function(){
    return axios.get('https://min-api.cryptocompare.com/data/histohour?fsym=ETH&tsym=USD&e=Gemini&limit=1');
}