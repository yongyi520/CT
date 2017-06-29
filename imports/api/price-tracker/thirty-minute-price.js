import axios from 'axios';

export const getGeminiLastThirtyMinutePriceRange = function(){
    return axios.get('https://min-api.cryptocompare.com/data/histominute?fsym=ETH&tsym=USD&e=Gemini&limit=70');
}