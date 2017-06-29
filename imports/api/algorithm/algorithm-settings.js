var algorithms = {
    gemini: {
        'buyLowSellHigh': {
            hourly: true
        }
    }
}

export const getAlgorithmSettings = function(){
    return algorithms;
}

export const setAlgorithm = function (exchange, algorithm_type, interval, onOff){
    algorithms[exchange][algorithm_type][interval] = onOff;
}