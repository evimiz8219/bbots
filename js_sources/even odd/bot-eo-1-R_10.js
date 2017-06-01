
        var LDP = isEvenOrOdd(Bot.getLastDigit());
        console.log('Even Odd', LDP)

        if (stats[LDP][0] > stats[LDP][1] && (stats[LDP][0] / 1.5) > stats[LDP][1]) {
            Bot.purchase('DIGITEVEN');
                console.log('Purchased:', 'DIGITEVEN ', 'at', new Date().toLocaleString());

        } else if (stats[LDP][1] > stats[LDP][0] && (stats[LDP][1] / 1.5) > stats[LDP][0]) {
            Bot.purchase('DIGITODD');
            console.log('Purchased:', 'DIGITODD ', 'at', new Date().toLocaleString());

        }

