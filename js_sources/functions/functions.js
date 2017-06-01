/**
 ************************
 *   Global variables   *
 ************************
 */

/**
 * Authentication token
 *
 * @type {string}
 */
var Token = 'XXXXXXXXXXX';

/**
 * Current bet size
 *
 * @type {number}
 */
var BetAmount = 1;

/**
 * Current asset to trade
 *
 * @type {string}
 */
var TradeSymbol = 'R_10';

/**
 * An object with a set of parameters defining trade contract etc, what is need for Bot initialization
 *
 * Depends on a global variable BetAmount and TradeSymbol
 *
 * @type {{symbol: string, amount, basis: string, candleInterval: number, contractTypes: [*], currency: string, duration: number, duration_unit: string}}
 */
var BotInitOptions = {
    symbol: TradeSymbol,
    amount: BetAmount,
    basis: 'stake',
    candleInterval: 60,
    contractTypes: ['DIGITEVEN', 'DIGITODD'],
    currency: 'USD',
    duration: 5,
    duration_unit: 't'
};

/**
 * Expected profit
 *
 * @type {number}
 */
var ExpectedProfit = 20;

/**
 * Maximum acceptable loss
 *
 * @type {number}
 */
var MaxAcceptableLoss = 10;

/**
 * Trade options needed to start the Bot each time as IsTradeActive === true
 *
 * Depends on a global variable MaxAcceptableLoss
 *
 * @type {{limitations: {maxLoss, maxTrades: number}}}
 */
var TradeOptions = {
    limitations: {
        maxLoss:MaxAcceptableLoss,
        maxTrades:10000
    }
};

/**
 * Maximum loss which is reached since last success
 * Optional - is used for analytical purposes
 *
 * @type {number}
 */
var CurrentMaxLoss = 0;

/**
 * Profit which is reached since last lost trade
 * Optional - is used for analytical purposes
 *
 * @type {number}
 */
var CurrentMaxProfit = 0;

/**
 * Total trading session profit
 *
 * @type {number}
 */
var TotalProfit = 0;

/**
 * Date and time when trade started
 *
 * @type {string}
 */
var StartDateTime = new Date().toLocaleString();

/**
 * Flag which defines whether a trade should remain active (should bot stop now or continue to trade)
 * Might be set by other functions and variables, such if expected profit is reached then set it to false etc.
 *
 * @type {boolean}
 */
var IsTradeActive = true;

/**
 * Real length of the price number
 * The price might be in 4,5 or whatever format, and its decimal part might be , therefore .12 or .1 etc,
 * which might impact determining real last digit (like in the example of .12 and .1 last digits would be
 * 2 and 0 accordingly, and NOT 2 and 1.
 * Is mainly used for LDP strategies.
 *
 * @type {number}
 */
var RealTickLength = 0;

/**
 * Contains percentage of each number to the array representation,
 * so lets say out of last 50 numbers there were 30 fifths, so it would look smth like
 * [x, x, x, x, x, 60, x, .... x]
 *
 * For Even/Odd its default value is [0, 0]
 * For all 10 digits its default value, therefore, should be [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
 *
 * @type {[*]}
 */
var DigitPercentStats = [];

/**
 * Contains counted amount of each last digit, during last X ticks
 *
 * i.e. [0] = 12, [1] = 25, ... [9] = 7
 *
 * @type {Array}
 */
var DigitStats = [];

/**
 * Total wins during the trading session
 *
 * Optional to use - for analytical purposes only
 *
 * @type {number}
 */
var WinsCount = 0;

/**
 * Total loss during the trading session
 *
 * Optional to use - for analytical purposes only
 *
 * @type {number}
 */
var LossCount = 0;

/**
 * Number of consequently received losses since last win
 *
 * Optional to use - for analytical purposes only
 *
 * @type {number}
 */
var LossChainLength = 0;

/**
 * Length of the maximum chain of consequently received losses during the trading session
 *
 * Optional to use - for analytical purposes only
 *
 * @type {number}
 */
var MaxLossChainLength = 0;

/**
 *********************
 *     Functions     *
 *********************
 */

/**
 * Placeholder for the function containing logic what would decide
 * whether it is a time to open a position.
 *
 * Number and types of the parameters might vary based on the strategy
 *
 * @param {Array} ticksList
 *
 * @returns {boolean}
 */
var IsSignalToTrade = function(ticksList) {
    return true;
};

/**
 * Helper to determine whether a given digit is odd or even
 *
 * Returns 0 if number is even and 1 is it is odd.
 *
 * @param {number} digit
 *
 * @returns {number}
 */
var IsEvenOrOdd = function (digit) {
    if (digit % 2 === 0) {
        return 0;
    } else {
        return 1;
    }
};

/**
 * Return a part (chunk) of the given list using a given chunk size
 *
 * @param {Array}  tickList
 * @param {number} chunkSize
 *
 * @returns {Array}
 */
var GetChunkOfTheList = function (tickList, chunkSize) {
    var chunk = tickList.slice(Math.max(tickList.length - chunkSize, 1));

    return chunk;
};

/**
 * Return a real last digit from the given tick value
 *
 * @param {number} tick
 * @param {number} tickRealLength
 *
 * @return {number}
 */
var GetLastDigitFromTick = function (tick, tickRealLength) {
    var tickString = tick.toString();

    var lastDigit = tickString.length === tickRealLength ? tickString.substr(-1) : 0;

    return lastDigit;
};

/**
 * Helper to determine whether trading session should remain active or to be stopped
 *
 * @param {number} totalProfit       Total session profit
 * @param {number} expectedProfit    Expected profit
 * @param {number} maxAcceptableLoss Maximum acceptable loss
 *
 * @return {boolean}
 */
var ShouldTradeRemainActive = function (totalProfit, expectedProfit, maxAcceptableLoss) {
    if (totalProfit > 0 && totalProfit >= expectedProfit) {
        return false;
    } else if (totalProfit  <= (maxAcceptableLoss * -1)) {
        return false;
    }

    return true;
};

/**
 * Return minimum element from the given array
 *
 * @param {Array} arr
 *
 * @return {*}
 */
var GetMinElementInArray = function (arr) {
    return Math.min.apply(null, arr)
};

/**
 * Return maximum element from the given array
 *
 * @param {Array} arr
 *
 * @return {*}
 */
var GetMaxElementInArray = function (arr) {
    return Math.max.apply(null, arr)
};

/**
 * Reset all the elements of the given array to zeros.
 * It Is used to reset statistics lists.
 * It is capable to recursively reset nested arrays.
 *
 * @param {Array} objectWithStats
 *
 * @return {Array}
 */
var ResetStatsList = function (objectWithStats) {
    var emptyStats = [];

    objectWithStats
        .forEach(function (element) {
            if (Array.isArray(element)) {
                emptyStats.push(ResetStatsList(element));
            } else {
                emptyStats.push(0);
            }
        });

    return emptyStats;
};

/**
 * Return an array with digits stats with the info about
 * first tick last digit -> Xth tick last digit value
 *
 * For example - how often after last digit equals 3 on current tick we had another 3 or 5 (whatever)
 * during last X ticks (taken from tick list)
 *
 * Mostly to be used with LDP strategies
 *
 * Depends on a "global" function GetLastDigitFromTick
 *
 * @param {Array}  ticksList       Array with ticks to analise
 * @param {number} statsListLength How many element would stats list contain
 * @param {number} tickRealLength  Real length of the tick number
 *
 * @return {Array}
 */
var GetBeginEndDigitStats = function (ticksList, statsListLength, tickRealLength) {

    /**
     * Size of the step to iterate back through the ticks history
     * If it = 6 then it means it would count each 5th tick (one more is used because of an entry tick)
     *
     * @type {number}
     */
    var step = 6;

    var listLength = ticksList.length;

    /**
     * Counter to be used in the loops
     *
     * @type {number}
     */
    var i = 0;

    var digitStats = [];

    for (i = 0; i < statsListLength; i += 1) {
        digitStats.push(0);
    }

    for (i = 0; i < listLength; i++) {
        var startDigit = GetLastDigitFromTick(ticksList[i], tickRealLength);

        var startDigitIndex  = startDigit;

        if (statsListLength === 2) {
            startDigitIndex = IsEvenOrOdd(startDigit);
        }

        if (ticksList.hasOwnProperty(i + step)) {
            var finishDigit      = GetLastDigitFromTick(ticksList[i + step], tickRealLength);
            var finishDigitIndex = finishDigit;

            if (statsListLength === 2) {
                finishDigitIndex = IsEvenOrOdd(finishDigit);
            }

            digitStats[startDigitIndex][finishDigitIndex]++;
        }
    }

    return digitStats;
};

/**
 * Return an array with digits stats
 * with the info about how many time did each last digit of the tick (0, 1.. 9) was met in a given tick list
 *
 * Mostly to be used with LDP strategies
 *
 * Depends on a "global" function GetLastDigitFromTick
 *
 * @param {Array}  ticksList       Array with ticks to analise
 * @param {number} statsListLength How many element would stats list contain
 * @param {number} tickRealLength  Real length of the tick number
 *
 * @return {Array}
 */
var GetDigitStats = function (ticksList, statsListLength, tickRealLength) {

    /**
     * Size of the step to iterate back through the ticks history
     * If it = 6 then it means it would count each 5th tick (one more is used because of an entry tick)
     *
     * @type {number}
     */
    var step = 6;

    var listLength = ticksList.length;

    /**
     * Counter to be used in the loops
     *
     * @type {number}
     */
    var i = 0;

    var digitStats = [];

    for (i = 0; i < statsListLength; i += 1) {
        digitStats.push(0);
    }

    for (i = 0; i < listLength; i++) {
        var startDigit = GetLastDigitFromTick(ticksList[i], tickRealLength);

        var startDigitIndex  = startDigit;

        if (statsListLength === 2) {
            startDigitIndex = IsEvenOrOdd(startDigit);
        }

        digitStats[startDigitIndex]++;
    }

    return digitStats;
};

/**
 * Return an array with a percents representation of each digit in a given list using a total number of counted digits
 *
 * For example an array [0 => 10, 1 => 5, 2 => 5] with totalCountedDigits = 20
 * would be converted to [0=>50 , 1 => 25, 2 => 25]
 *
 * Mostly to be used with LDP strategies
 *
 * @param {Array}  statsList
 * @param {number} totalCountedDigits
 *
 * @return {Array}
 */
var GetDigitPercentStats = function(statsList, totalCountedDigits) {
    var length = statsList.length;

    for (var i = 0; i < length; i++) {
        statsList[i] = statsList[i] * 100 / totalCountedDigits;
    }

    return statsList;
};

/**
 * Shows consolidated information with some statistical data regarding current session results
 *
 * @param {Object}  tradeStatsDto A DTO what has some stats info to display
 * @param {boolean} afterTrade    An optional flag , conditionally enabling displaying some additional data (if needed)
 *
 * Some predefined values are:
 *
 *      Net profit     = Bot.readDetails(4));
 *      Trade result   = Bot.readDetails(11));
 *      Stake size     = Bot.readDetails(2));
 *      Number of runs = Bot.getTotalRuns()
 *
 *  Currently, DTO structure looks like:
 *
 *      var tradeStatsDto = {
 *       'total_profit'         : TotalProfit,
 *       'wins_count'           : WinsCount,
 *       'loss_count'           : LossCount,
 *       'loss_chain_length'    : LossChainLength,
 *       'max_loss_chain_length': MaxLossChainLength
 *   };
 *
 * This function is sort of a placeholder since it might be changed a lot depending on a given set of parameters.
 *
 * Depends on a global object Bot
 */
var ShowTradeSessionStats = function (tradeStatsDto, afterTrade) {

    console.log('--------------------------');
    console.log('Number of runs  =', Bot.getTotalRuns());
    console.log('--------------------------');
    console.log('- net profit   =', Bot.readDetails(4));
    console.log('- trade result =', Bot.readDetails(11));
    console.log('- stake size   =', Bot.readDetails(2));
    console.log('--------------------------');
    console.log('    Total Session Wins', tradeStatsDto.wins_count);
    console.log('    Total Session Loss', tradeStatsDto.loss_count);
    console.log('--------------------------');
    console.log('    Current Consequence Loss', tradeStatsDto.loss_chain_length);
    console.log('    Max     Consequence Loss', tradeStatsDto.max_loss_chain_length);
    console.log('--------------------------');
    console.log();
    console.log('    Total Profit', tradeStatsDto.total_profit);
    console.log();
};

/**
 **************************************************
 *   SetUp - initializing some global variables   *
 **************************************************
 */
Bot.init(Token, BotInitOptions);

/**
 * Determine real length of the price number
 * to be able to properly identify last digit of the tick.
 * It depends on an external global variable
 */
GetChunkOfTheList(Bot.getTicks(), 100)
    .forEach(function (element) {
        RealTickLength = element.toString().length > RealTickLength ?
            element.toString().length :
            RealTickLength
        ;
    });

console.log('Starting bot...');

while (IsTradeActive) {

    Bot.start(TradeOptions) ;

    console.log('====================================');
    console.log('Preparing Proposals');

    var numberOfTicksToAnalyze = 1000;

    while(watch('before')) {
        console.log('====================================');

        DigitStats = GetDigitStats(
            GetChunkOfTheList(Bot.getTicks(), numberOfTicksToAnalyze), 10, RealTickLength
        );

        DigitPercentStats = GetDigitPercentStats(DigitStats, numberOfTicksToAnalyze);

        Bot.purchase('DIGITODD');
    }

    while(watch('during')) {
    }

    console.log('Last Tick  After', Bot.getLastTick());
    console.log('Last Digit After', Bot.getLastDigit());
    console.log('--------------------------');
    console.log('Contract finished.');

    var tradeResult = Bot.readDetails(11);

    if (tradeResult === 'win') {
        WinsCount++;
        LossChainLength = 0;
    } else if (tradeResult === 'loss') {
        LossCount++;
        LossChainLength++;
    }

    if (LossChainLength > MaxLossChainLength) {
        MaxLossChainLength = LossChainLength;
    }

    TotalProfit = Bot.getTotalProfit();

    var tradeStatsDto = {
        'total_profit'         : TotalProfit,
        'wins_count'           : WinsCount,
        'loss_count'           : LossCount,
        'loss_chain_length'    : LossChainLength,
        'max_loss_chain_length': MaxLossChainLength
    };

    ShowTradeSessionStats(tradeStatsDto, false);

    // Prevent max sell alert because of trading too fast
    sleep(1);

    IsTradeActive = ShouldTradeRemainActive(TotalProfit, ExpectedProfit, MaxAcceptableLoss);
}

console.log('Trade started at', StartDateTime);
console.log('Trade finished at', new Date().toLocaleString());
console.log(BotInitOptions);