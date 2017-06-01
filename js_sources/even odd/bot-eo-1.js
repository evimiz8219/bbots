//// Even odd



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

var percentStats = [0, 0];
var stats = [];

var winsCount = 0;
var lossCount = 0;

var totalBet;

var lossChainLength    = 0;
var currentMaxLossChainLength = 0;

//// Functions

var isSignalToTrade = function(ticksList, LDP) {

    ticksList.forEach(function (tick) {
        console.log('tick', tick);

        if (getLastDigitFromTick(tick) === LDP) {
            return false;
        }
    });

    return true;
};

var isEvenOrOdd = function (digit) {
    if (digit % 2 === 0) {
        return 0;
    } else {
        return 1;
    }
};

var getLastDigitFromTick = function (tick) {
    var tickString = tick.toString();

    var lastDigit = tickString.length === numberLength ? tickString.substr(-1) : 0;

    // console.log('Tick', tick, 'Digit', lastDigit);

    return lastDigit;
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
    percentStats = [0, 0];

    var step = 6;
    var listLength = ticksList.length;

    for (var i = 0; i < listLength; i++) {
        var startDigit = getLastDigitFromTick(ticksList[i]);

        percentStats[isEvenOrOdd(startDigit)]++;

        if (ticksList.hasOwnProperty(i + step)) {
            var finishDigit = getLastDigitFromTick(ticksList[i + step]);

            stats[isEvenOrOdd(startDigit)][isEvenOrOdd(finishDigit)]++;
        }
    }
    // console.log('percentStats 1');
    // console.log(percentStats);
    // console.log('Stats 1');
    // console.log(stats);
};

var updatePercentStats = function(listLength) {

    var length = percentStats.length;

    for (var i = 0; i < length; i++) {
        percentStats[i] = percentStats[i] * 100 / listLength;
    }

    // console.log('percentStats 2');
    //
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
    stats[0] = [0,0];
    stats[1] = [0,0];

    percentStats = [0, 0];
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
    contractTypes: ['DIGITEVEN', 'DIGITODD'],
    currency: 'USD',
    duration: 5,
    duration_unit: 't',
    // prediction: 0,
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
        resetAllStats();

        updateStats(getListChunk(Bot.getTicks(), 100));
        updatePercentStats(100);

        LDP = isEvenOrOdd(Bot.getLastDigit());
        console.log('Even Odd', LDP)

        if (stats[LDP][0] > stats[LDP][1] && (stats[LDP][0] / 1.5) > stats[LDP][1]) {
            Bot.purchase('DIGITEVEN');
                console.log('Purchased:', 'DIGITEVEN ', 'at', new Date().toLocaleString());

        } else if (stats[LDP][1] > stats[LDP][0] && (stats[LDP][1] / 1.5) > stats[LDP][0]) {
            Bot.purchase('DIGITODD');
            console.log('Purchased:', 'DIGITODD ', 'at', new Date().toLocaleString());

        }

        displayStats(false);
    }

    while(watch('during')) {
        // console.log('Last Tick', Bot.getLastTick())
    }
    console.log('Last Tick After', Bot.getLastTick());

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
