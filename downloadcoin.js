const rp = require('request-promise');
const cheerio = require('cheerio');
const options = {
  uri: 'https://coinmarketcap.com/currencies/theta/#markets',
  transform: function (body) {
    return cheerio.load(body);
  }
};

const jsonfile = require('jsonfile')
let file_location = "./localdb/currentreport.json";

// 0 - Global variables
//let markets = []

// 1 - Downlaod all from the page

let donwload = function() {

  let markets = []

  return new Promise(function(resolve, reject) {

    rp(options)
      .then(($) => {

        //console.log($);
        let col = [];

        let lineslength = $('#markets-table tbody tr').length;

        console.log(lineslength)

        $('#markets-table tbody tr').each(function(i, elem) {
          let name = $(this).find(':nth-child(2)').text().replace(/(\r\n|\n|\r)/gm, "");
          let pair = $(this).find(':nth-child(3)').text().split("/");
          let pair1 = pair[0];
          let pair2 = pair[1];

          let vol = $(this).find(':nth-child(4)').text().replace(/\D/g,'');
          let price = $(this).find(':nth-child(5)').text().replace('$','').replace(/(\r\n|\n|\r)/gm, "");

          let ts = new Date().getTime();

          let row = { name: name.substring(0, name.length / 2), pair : pair, pair1: pair1, pair2: pair2, vol : vol, price: price, ts : ts }

          //
          markets.push(row);
          //

          if (lineslength == i + 1) {
            console.log("resolve")
            resolve(markets)
          }

        });

      })
      .catch((err) => {
        console.log(err);
      });

  });

}

//
//

let volume_minimum = 10000
let ratio_minimum = 1.05;

//
//

// 2 -
donwload().then(function(market) {
  console.log(market)

  //console.log(market)

  // 1 - Filter by Volume

  let marketVolFilter = market.filter(mkt => mkt.vol > volume_minimum);

  console.log(marketVolFilter)

  // 2 - Get Trading ratio from all possibilities

  /*

    2.1 - Creates ratios

  */

  let exchanges_analysis = [];
  //

  let idx;

  for (idx = 0; idx < marketVolFilter.length; idx++) {

    let exchange = marketVolFilter[idx];

    let edx;

    marketVolFilter.splice(idx, 1)

    for (edx = 0; edx < marketVolFilter.length; edx++) {

      let exchange2 = marketVolFilter[edx];

      // ratio arbitrage

      let ratio = exchange.price / exchange2.price

      let exchange1_exchange2 = {
        exchange1_pair1 : exchange.pair1,
        exchange2_pair1 : exchange2.pair1,
        exchange1_pair2 : exchange.pair2,
        exchange2_pair2 : exchange2.pair2,
        exchange1_name : exchange.name,
        exchange2_name : exchange2.name,
        exchange1_price : exchange.price,
        exchange2_price : exchange2.price,
        exchange1_vol : exchange.vol,
        exchange2_vol : exchange2.vol,
        ts : exchange.ts,
        ratio : ratio
      };

      //exchanges_analysis.push(exchange1_exchange2);

      jsonfile.writeFile(file_location, exchange1_exchange2, { flag: 'a' }, function (err) {
        if (err) console.error(err)
      })

    }


  }
  // end marketVolFilter

  /*

    2.2 - Filter ratios

  */

  let ratioVolFilter = exchanges_analysis.filter(mkt => mkt.ratio > ratio_minimum);

  console.log(ratioVolFilter);

  /*

    2.3 - Save on localdb/currentreport.js

  */
  /*
  const jsonfile = require('jsonfile')
  let file_location = "./localdb/currentreport.json";

  jsonfile.writeFile(file_location, ratioVolFilter, { flag: 'a' }, function (err) {
    if (err) console.error(err)
  })
  */

})
