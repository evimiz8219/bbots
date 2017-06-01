//// Digit diff if < 10% and less frequent finish ldp from last digit was not shown in last 6 ticks



/// Authentication

var token = 'XXXXXXXXXXX';

//// Variables

var betAmount = 1;

var expectedProfit    = 20;
var maxAcceptableLoss = 10;

var currentMaxLoss   = 0;
var currentMaxProfit = 0;

var totalProfit = 0;

var startDateTime, endDateTime;

var isTradeActive = true;

var LDP = 0;

var numberLength = 0;

var percentStats = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var stats = [];

var winsCount = 0;
var lossCount = 0;

var totalBet;

var lossChainLength    = 0;
var currentMaxLossChainLength = 0;

//// Functions

var isSignalToTrade = function(ticksList, LDP) {

    // console.log('ticksList', ticksList);

    ticksList.forEach(function (tick) {
        console.log('tick', tick);

        if (getLastDigitFromTick(tick) === LDP) {
            return false;
        }
    });

    return true;
};

var getLastDigitFromTick = function (tick) {
    var tickString = tick.toString();

    return tickString.length === numberLength ? tickString.substr(-1) : 0;
};

var shouldTradeRemainActive = function (totalProfit) {
    if (totalProfit > 0 && totalProfit >= expectedProfit) {
        return false;
    } else if (totalProfit  <= (maxAcceptableLoss * -1)) {
        return false;
    }

    return true;
};

var updateStats = function (ticksList) {
    percentStats = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    var step = 6;
    var listLength = ticksList.length;

    for (var i = 0; i < listLength; i++) {
        var startDigit = getLastDigitFromTick(ticksList[i]);

        percentStats[startDigit]++;

        if (ticksList.hasOwnProperty(i + step)) {
            var finishDigit = getLastDigitFromTick(ticksList[i + step]);

            stats[startDigit][finishDigit]++;
        }
    }
    // console.log(percentStats);
};

var updatePercentStats = function(listLength) {

    var length = percentStats.length;

    for (var i = 0; i < length; i++) {
        percentStats[i] = percentStats[i] * 100 / listLength;
    }

    // console.log(percentStats);
};

var getListChunk = function (tickList, chunkSize) {
    var chunk = tickList.slice(Math.max(tickList.length - chunkSize, 1));

    return chunk;
};

var displayStats = function (afterTrade) {
    console.log('--------------------------');

    if (afterTrade) {
        console.log();
        console.log('- net profit   =', Bot.readDetails(4));
        console.log('- trade result =', Bot.readDetails(11));
        console.log('- stake size   =', Bot.readDetails(2));
    }

    console.log();
    console.log('Current Max Loss       =' , currentMaxLoss);
    console.log('Current Max Profit     =' , currentMaxProfit);
    console.log();
    console.log('Wins Count =', winsCount);
    console.log('Loss Count =', lossCount);
    console.log();
    console.log('Number of runs         =', Bot.getTotalRuns());
    console.log('Current Max Loss Chain =' , currentMaxLossChainLength);
    console.log();
    console.log('Total Profit at the moment =' , totalProfit);
};

var resetAllStats = function () {
    stats[0] = [0,0,0,0,0,0,0,0,0,0];
    stats[1] = [0,0,0,0,0,0,0,0,0,0];
    stats[2] = [0,0,0,0,0,0,0,0,0,0];
    stats[3] = [0,0,0,0,0,0,0,0,0,0];
    stats[4] = [0,0,0,0,0,0,0,0,0,0];
    stats[5] = [0,0,0,0,0,0,0,0,0,0];
    stats[6] = [0,0,0,0,0,0,0,0,0,0];
    stats[7] = [0,0,0,0,0,0,0,0,0,0];
    stats[8] = [0,0,0,0,0,0,0,0,0,0];
    stats[9] = [0,0,0,0,0,0,0,0,0,0];

    percentStats = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
};

var getMinElInArray = function (arr) {
    return Math.min.apply(null, arr)
};

var getMaxElInArray = function (arr) {
    return Math.max.apply(null, arr)
};

//// Bot parameters

var initOptions = {
    symbol: 'R_100',
    amount: betAmount,
    basis: 'stake',
    candleInterval: 60,
    contractTypes: ['DIGITDIFF', 'DIGITMATCH'],
    currency: 'USD',
    duration: 5,
    duration_unit: 't',
    prediction: LDP,
};

var tradeOptions = {
    limitations: {
        maxLoss:maxAcceptableLoss,
        maxTrades:10000
    }
};

//// Set Up

startDateTime = new Date().toLocaleString();

console.log('Starting bot...');

resetAllStats();

//// Trade

Bot.init(token, initOptions);

console.log('Trade started at', startDateTime );

// Determine real length of the price number  (to be able to properly identify last digit of the tick
getListChunk(Bot.getTicks(), 100)
    .forEach(function (element) {
        numberLength = element.toString().length > numberLength ?
            element.toString().length :
            numberLength
        ;
    });

while (isTradeActive) {

    Bot.start(tradeOptions) ;

    console.log('====================================');
    console.log('Preparing Proposals');

    while(watch('before')) {
        console.log('====================================');

        console.log();
        updateStats(getListChunk(Bot.getTicks(), 100));
        updatePercentStats(100);

        LDP = stats[Bot.getLastDigit()].indexOf(getMinElInArray(stats[Bot.getLastDigit()]));

        displayStats(false);

        console.log('LDP percentage', LDP, '=', percentStats[LDP]);

        if (percentStats[LDP] < 7) {

            if (isSignalToTrade(getListChunk(Bot.getTicks(), 6), LDP)) {
                initOptions.prediction = LDP;
                Bot.init(token, initOptions);

                Bot.purchase('DIGITDIFF');
                console.log('Purchased:', 'DIGITDIFF from', LDP, 'at', new Date().toLocaleString());
            }
        }
    }

    while(watch('during')) {
        console.log('Last Tick', Bot.getLastTick())
    }

    console.log('--------------------------');
    console.log('Contract finished.');

    var tradeResult = Bot.readDetails(11);

    if (tradeResult === 'win') {
        winsCount++;
        lossChainLength = 0;
    } else if (tradeResult === 'loss') {
        lossCount++;
        lossChainLength++;
    }

    totalProfit = Bot.getTotalProfit();

    if ((totalProfit < 0) && (totalProfit < currentMaxLoss)) {
        currentMaxLoss = totalProfit;
    }

    if ((totalProfit > 0) && (totalProfit > currentMaxProfit)) {
        currentMaxProfit = totalProfit;
    }

    if (lossChainLength > currentMaxLossChainLength) {
        currentMaxLossChainLength = lossChainLength;
    }

    displayStats(true);
    resetAllStats();

    isTradeActive = shouldTradeRemainActive(totalProfit);

    // Prevent max sell alert because of trading too fast
    // sleep(1)
}

console.log('Trade started at', startDateTime);
console.log('Trade finished at', new Date().toLocaleString());
console.log(initOptions);
