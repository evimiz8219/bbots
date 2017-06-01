#!/usr/bin/env bash

cp -v ./bot-rf-1-R_WORK.js ./bot-rf-1-R_10.js
sed -i -e 's/R_100/R_10/g' ./bot-rf-1-R_10.js

cp -v ./bot-rf-1-R_WORK.js ./bot-rf-1-R_25.js
sed -i -e 's/R_100/R_25/g' ./bot-rf-1-R_25.js

cp -v ./bot-rf-1-R_WORK.js ./bot-rf-1-R_50.js
sed -i -e 's/R_100/R_50/g' ./bot-rf-1-R_50.js

cp -v ./bot-rf-1-R_WORK.js ./bot-rf-1-R_75.js
sed -i -e 's/R_100/R_75/g' ./bot-rf-1-R_75.js

cp -v ./bot-rf-1-R_WORK.js ./bot-rf-1-R_100.js
sed -i -e 's/R_100/R_100/g' ./bot-rf-1-R_100.js

cp -v ./bot-rf-1-R_WORK.js ./bot-rf-1-RDBULL.js
sed -i -e 's/R_100/RDBULL/g' ./bot-rf-1-RDBULL.js

cp -v ./bot-rf-1-R_WORK.js ./bot-rf-1-RDBEAR.js
sed -i -e 's/R_100/RDBEAR/g' ./bot-rf-1-RDBEAR.js

