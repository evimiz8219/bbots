
/*
 exports.default = [
 { value: 'CALL', text: 'Rise', img: 'img/trade-call.svg', ticks: true, barrier: false },
 { value: 'PUT', text: 'Fall', img: 'img/trade-put.svg', ticks: true, barrier: false },
 { value: 'HIGHER', text: 'Higher', img: 'img/trade-higher.svg', ticks: false, barrier: false },
 { value: 'LOWER', text: 'Lower', img: 'img/trade-lower.svg', ticks: false, barrier: false },
 { value: 'DIGITMATCH', text: 'Digit Match', img: 'img/trade-digitmatch.svg', ticks: true, barrier: true },
 { value: 'DIGITDIFF', text: 'Digit Differs', img: 'img/trade-digitdiff.svg', tick: true, barrier: true },
 { value: 'DIGITOVER', text: 'Digit Over', img: 'img/trade-digitover.svg', tick: true, barrier: true },
 { value: 'DIGITUNDER', text: 'Digit Under', img: 'img/trade-digitunder.svg', tick: true, barrier: true },
 { value: 'DIGITEVEN', text: 'Digit Even', img: 'img/trade-digiteven.svg', tick: true, barrier: false },
 { value: 'DIGITODD', text: 'Digit Odd', img: 'img/trade-digitodd.svg', tick: true, barrier: false },
 { value: 'ASIANU', text: 'Asian Up', img: 'img/trade-asianu.svg', ticks: true, barrier: false },
 { value: 'ASIAND', text: 'Asian Down', img: 'img/trade-asiand.svg', ticks: true, barrier: false },
 { value: 'EXPIRYRANGE', text: 'Ends Between', img: 'img/trade-expiryrange.svg', ticks: false, barrier: false },
 { value: 'EXPIRYMISS', text: 'Ends Outside', img: 'img/trade-expirymiss.svg', ticks: false, barrier: false },
 { value: 'RANGE', text: 'Stays Between', img: 'img/trade-range.svg', ticks: false, barrier: false },
 { value: 'UPORDOWN', text: 'Goes Outside', img: 'img/trade-upordown.svg', ticks: false, barrier: false },
 { value: 'ONETOUCH', text: 'Touches', img: 'img/trade-onetouch.svg', ticks: false, barrier: false },
 { value: 'NOTOUCH', text: 'Does Not Touch', img: 'img/trade-notouch.svg', ticks: false, barrier: false },
 { value: 'SPREADU', text: 'Spread Long', img: 'img/trade-spreadu.svg', ticks: false, barrier: false },
 { value: 'SPREADD', text: 'Spread Short', img: 'img/trade-spreadu.svg', ticks: false, barrier: false }];


 var tradeOptionToProposal = exports.tradeOptionToProposal = function tradeOptionToProposal(tradeOption) {
 return tradeOption.contractTypes.map(function (type) {
 return Object.assign({
 duration_unit: tradeOption.duration_unit,
 basis: 'stake',
 currency: tradeOption.currency,
 symbol: tradeOption.symbol,
 duration: tradeOption.duration,
 amount: tradeOption.amount.toFixed(2),
 contract_type: type
 }, tradeOption.prediction !== undefined && {
 barrier: tradeOption.prediction
 }, tradeOption.barrierOffset !== undefined && {
 barrier: tradeOption.barrierOffset
 }, tradeOption.secondBarrierOffset !== undefined && {
 barrier2: tradeOption.secondBarrierOffset
 });
 });
 };

*/

/**

Bot.start(...) // (1) trade definitions
while(watch('before')) {
    // (2) before purchase
    Bot.purchase('CALL') // Purchase
}
while(watch('during')) {
    // (3) during a purchased contract
}
// (4) after contract is finished
*/

/**
 *
 Bot {
 init: { prototype: {}, length: 0 },
 start: { prototype: {}, length: 0 },
 stop: { prototype: {}, length: 0 },
 purchase: { prototype: {}, length: 0 },
 getAskPrice: { prototype: {}, length: 0 },
 getPayout: { prototype: {}, length: 0 },
 isSellAvailable: { prototype: {}, length: 0 },
 sellAtMarket: { prototype: {}, length: 0 },
 getSellPrice: { prototype: {}, length: 0 },
 isResult: { prototype: {}, length: 0 },
 readDetails: { prototype: {}, length: 0 },
 getTime: { prototype: {}, length: 0 },
 isCandleBlack: { prototype: {}, length: 0 },
 candleValues: { prototype: {}, length: 0 },
 candleField: { prototype: {}, length: 0 },
 notify: { prototype: {}, length: 0 },
 getTotalRuns: { prototype: {}, length: 0 },
 getBalance: { prototype: {}, length: 0 },
 getTotalProfit: { prototype: {}, length: 0 },
 sma: { prototype: {}, length: 0 },
 smaa: { prototype: {}, length: 0 },
 ema: { prototype: {}, length: 0 },
 emaa: { prototype: {}, length: 0 },
 rsi: { prototype: {}, length: 0 },
 rsia: { prototype: {}, length: 0 },
 bb: { prototype: {}, length: 0 },
 bba: { prototype: {}, length: 0 },
 macda: { prototype: {}, length: 0 },
 getLastTick: { prototype: {}, length: 0 },
 getLastDigit: { prototype: {}, length: 0 },
 getTicks: { prototype: {}, length: 0 },
 checkDirection: { prototype: {}, length: 0 },
 getOhlcFromEnd: { prototype: {}, length: 0 },
 getOhlc: { prototype: {}, length: 0 } }

 *
* */

// _calculateLastDigitStats

// var _calculateLastDigitStats = __webpack_require__(308);

/*
 Object.defineProperty(exports, 'calculateLastDigitStats', {
 enumerable: true,
 get: function get() {
 return _interopRequireDefault(_calculateLastDigitStats).default;
 }
 });
 */

// console.log(Bot.getTicks(10));

// TradeEngine.prototype.start = function start(tradeOptions) {


// Date.prototype.timeNow = function(){
//     return ((this.getHours() < 10)?"0":"") + ((this.getHours()>12)?(this.getHours()-12):this.getHours()) +":"+
//         ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+
//         ((this.getSeconds() < 10)?"0":"") + this.getSeconds() +
//         ((this.getHours()>12)?('PM'):'AM'); };
//
// Date.prototype.today = function () {
//     return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
// };


/// node ~/prj/bnr/node_modules/binary-bot/lib/index.js bot-rf-1-R_50.js

////

var token = 'XXXXXXXXXXX';

console.log('Starting bot...');

var betAmount = 1;

var expectedProfit    = 10;
var maxAcceptableLoss = 10;

var initOptions = {
    symbol: 'R_100',
    amount: betAmount,
    basis: 'stake',
    candleInterval: 60,
    contractTypes: ['CALL', 'PUT'],
    currency: 'USD',
    duration: 5,
    duration_unit: 't'
};

var tradeOptions = {
    limitations: {
        maxLoss:10,
        maxTrades:10000
    }
};


var shouldTradeRemainActive = function (totalProfit) {
    console.log('totalProfit', totalProfit);
    if (totalProfit > 0 && totalProfit >= expectedProfit) {
        return false;
    } else if (totalProfit  <= (maxAcceptableLoss * -1)) {
        return false;
    }

    return true;
};

var startDateTime = Date.today + ' ' + Date.timeNow;
var endDateTime;

/////

Bot.init(token, initOptions);

var isTradeActive = true;

console.log('Trade started at ', startDateTime );

while (isTradeActive) {

    Bot.start(tradeOptions) ;

    console.log('Preparing Proposals');

    // watch('before');

    while(watch('before')) {
        Bot.purchase('CALL');
        console.log('Purchased:', 'CALL');
    }

    while(watch('during')) {
        // if (Bot.isSellAvailable()) {
        //     console.log('Contract Sold')
        // }
    }

    // initOptions.amount = betAmount;
    // Bot.init(token, initOptions);


    console.log('Contract finished. Contract details:');
    console.log('- ref number  = ', Bot.readDetails(1));
    console.log('- stake size  = ', Bot.readDetails(2));
    console.log('- payout      = ', Bot.readDetails(3));
    console.log('- net profit  = ', Bot.readDetails(4));
    // console.log('- five?', Bot.readDetails(5));
    // console.log('- six? ', Bot.readDetails(6));
    // console.log('- seven? ', Bot.readDetails(7));
    // console.log('- eight? ', Bot.readDetails(8));
    // console.log('- nine? ', Bot.readDetails(9));
    // console.log('- ten? ', Bot.readDetails(10));
    console.log('- trade result = ', Bot.readDetails(11));
    // console.log('- 12?', Bot.readDetails(12));
    // console.log('- 13?', Bot.readDetails(13));
    // console.log('- 14?', Bot.readDetails(14));
    // console.log('- 15?', Bot.readDetails(15));
    // console.log('- 16?', Bot.readDetails(16));
    // console.log('- 17?', Bot.readDetails(17));
    // console.log('- 18?', Bot.readDetails(18));
    // console.log('- 19?', Bot.readDetails(19));
    // console.log('- 20?', Bot.readDetails(20));
    console.log('Total Profit at the moment = ' , Bot.getTotalProfit());
    console.log('Number of runs = ', Bot.getTotalRuns());
    console.log('Current Balance = ', Bot.getBalance());

    isTradeActive = shouldTradeRemainActive(Bot.getTotalProfit());
    // isTradeActive = false;

    // console.log(isTradeActive);

    // if (isTradeActive === false) {

        // Bot.stop();
    // }

    // Prevent max sell alert because of trading too fast
    sleep(1)
}

// Bot.stop();

// endDateTime = Date.today + ' ' + Date.timeNow;
//
// console.log('Trade started at', startDateTime );
// console.log('Trade finished at', endDateTime);
//
// var message = Bot.getTotalProfit() > 0 ?
//     "Expected profit of " + expectedProfit + " is reached":
//     "Maximum loss of " + maxAcceptableLoss + " is reached";
// console.log(message);
// console.log('Total of ' , Bot.getTotalRuns(), ' runs have been executed');
// console.log('Current Balance ' , Bot.getBalance());

