var token = 'XXXXXXXXXXX';

console.log('Starting bot...');

var betAmount = 1;

var expectedProfit    = 10;
var maxAcceptableLoss = 10;

var currentMaxLoss   = 0;
var currentMaxProfit = 0;

var startDateTime = new Date().toLocaleString();
var endDateTime;

var signalType = false;

var upOneWinsCount = 0;
var upTwoWinsCount = 0;
var upOneLossCount = 0;
var upTwoLossCount = 0;

var downOneWinsCount = 0;
var downTwoWinsCount = 0;
var downOneLossCount = 0;
var downTwoLossCount = 0;

var isTradeActive = true;

var ticksList;
var tickListUp;
var tickListDown;

//////

var initOptions = {
    symbol: 'RDBULL',
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

var isSignalUp = function(ticksList) {

    var zeroTick    = ticksList.shift();
    var firstTick   = ticksList.shift();
    var secondTick  = ticksList.shift();
    var thirdTick   = ticksList.shift();
    var forthTick   = ticksList.shift();
    var fifthTick   = ticksList.shift();
    var sixthTick   = ticksList.shift();
    var seventhTick = ticksList.shift();

    if (firstTick > zeroTick) {
        if (secondTick > firstTick) {
            if (thirdTick < secondTick) {
                if (forthTick > thirdTick) {
                    if (fifthTick < forthTick) {
                        if (sixthTick > fifthTick) {
                            if (seventhTick < sixthTick) {
                                if (forthTick < secondTick && seventhTick > fifthTick) {
                                    signalType = 'upOne';

                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
        if (firstTick < zeroTick) {
        if (secondTick < firstTick) {
            if (thirdTick > secondTick) {
                if (forthTick < thirdTick) {
                    if (fifthTick > forthTick) {
                        if (sixthTick < fifthTick) {
                            if (seventhTick > sixthTick) {
                                if (forthTick < secondTick && seventhTick > fifthTick) {
                                    signalType = 'upTwo';

                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    signalType = false;

    return false;
};

var isSignalDown = function(ticksList) {

    var zeroTick    = ticksList.shift();
    var firstTick   = ticksList.shift();
    var secondTick  = ticksList.shift();
    var thirdTick   = ticksList.shift();
    var forthTick   = ticksList.shift();
    var fifthTick   = ticksList.shift();
    var sixthTick   = ticksList.shift();
    var seventhTick = ticksList.shift();

    if (firstTick > zeroTick) {
        if (secondTick > firstTick) {
            if (thirdTick < secondTick) {
                if (forthTick > thirdTick) {
                    if (fifthTick < forthTick) {
                        if (sixthTick > fifthTick) {
                            if (seventhTick < sixthTick) {
                                if (forthTick > secondTick && seventhTick < fifthTick) {
                                    signalType = 'downOne';

                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (firstTick < zeroTick) {
        if (secondTick < firstTick) {
            if (thirdTick > secondTick) {
                if (forthTick < thirdTick) {
                    if (fifthTick > forthTick) {
                        if (sixthTick < fifthTick) {
                            if (seventhTick > sixthTick) {
                                if (forthTick > secondTick && seventhTick < fifthTick) {
                                    signalType = 'downTwo';

                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    signalType = false;

    return false;
};

var shouldTradeRemainActive = function (totalProfit) {
    if (totalProfit > 0 && totalProfit >= expectedProfit) {
        return false;
    } else if (totalProfit  <= (maxAcceptableLoss * -1)) {
        return false;
    }

    return true;
};

/////

Bot.init(token, initOptions);

console.log('Trade started at', startDateTime );


while (isTradeActive) {

    Bot.start(tradeOptions) ;

    console.log('Preparing Proposals');

    while(watch('before')) {
        ticksList = Bot.getTicks();

        ticksListUp   = ticksList.slice(Math.max(ticksList.length - 8, 1));
        ticksListDown = ticksList.slice(Math.max(ticksList.length - 8, 1));

        if (isSignalUp(ticksListUp)) {
            Bot.purchase('CALL');
            console.log('Purchased:', 'CALL', 'at', new Date().toLocaleString());
        } else if (isSignalDown(ticksListDown)) {
            Bot.purchase('PUT');
            console.log('Purchased:', 'PUT', 'at', new Date().toLocaleString());
        }
    }

    while(watch('during')) {
        console.log('In purchase now...', new Date().toLocaleString());
    }

    console.log('Contract finished. Contract details:');
    console.log('- ref number    =', Bot.readDetails(1));
    console.log('- stake size    =', Bot.readDetails(2));
    console.log('- payout        =', Bot.readDetails(3));
    console.log('- net profit    =', Bot.readDetails(4));
    console.log('- trade result  =', Bot.readDetails(11));

    var tradeResult = Bot.readDetails(11);

    if (tradeResult === 'win') {
        switch (signalType) {
            case 'upOne':
                upOneWinsCount += 1;
                break;
            case 'upTwo':
                upTwoWinsCount += 1;
                break;
            case 'downOne':
                downOneWinsCount += 1;
                break;
            case 'downTwo':
                downTwoWinsCount += 1;
                break;

        }
    } else if (tradeResult === 'loss') {
        switch (signalType) {
            case 'upOne':
                upOneLossCount += 1;
                break;
            case 'upTwo':
                upTwoLossCount += 1;
                break;
            case 'downOne':
                downOneLossCount += 1;
                break;
            case 'downTwo':
                downTwoLossCount += 1;
                break;

        }
    }

    console.log('Breaking down signals stats:');

    console.log('upOneWinsCount   =', upOneWinsCount, 'upTwoWinsCount     =', upTwoWinsCount);
    console.log('downOneWinsCount =', downOneWinsCount, 'downTwoWinsCount =', downTwoWinsCount);
    console.log('upOneLossCount   =', upOneLossCount, 'upTwoLossCount     =', upTwoLossCount);
    console.log('downOneLossCount =', downOneLossCount, 'downTwoLossCount =', downTwoLossCount);

    var totalProfit = Bot.getTotalProfit();


    if ((totalProfit < 0) && (totalProfit < currentMaxLoss)) {
        currentMaxLoss = totalProfit;
    }

    if ((totalProfit > 0) && (totalProfit > currentMaxProfit)) {
        currentMaxProfit = totalProfit;
    }

    console.log('Current Balance =', Bot.getBalance());

    console.log('Current Max Loss   =' , currentMaxLoss);
    console.log('Current Max Profit =' , currentMaxProfit);

    console.log('Number of runs  =', Bot.getTotalRuns());
    console.log('Total Profit at the moment = ' , totalProfit);

    isTradeActive = shouldTradeRemainActive(totalProfit);

    // Prevent max sell alert because of trading too fast
    // sleep(1)
}

console.log('Trade started at', startDateTime);
console.log('Trade finished at', new Date().toLocaleString());
console.log(initOptions);
