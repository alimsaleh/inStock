const express = require('express');
const app = express();
//allow heroku to set port
var port = process.env.PORT || 8080;
var request = require('request');
var cheerio = require("cheerio");
var qs = require('querystring');

//request options for asinlabs
var asinlaboptions = {
  url: '',
  headers: {
    'User-Agent': 'request',
    "Referer": "http://www.asinlab.com/asin-to-upc/"
  }
};

//request options for brickseek
var brickseekoptions = {
  url: 'https://brickseek.com/walmart-inventory-checker/',
  form: {
    search_method: 'upc',
    sku: '',
    sort: 'distance',
    upc: '',
    zip: 48174
  },
  headers: {
    'User-Agent': 'request',
    'Origin': "https://brickseek.com",
    'Referer': 'https://brickseek.com/walmart-inventory-checker/',
  }
}

app.listen(port, () => {
  //console.log('Server started!');
});


app.route('/api').get((req, res) => {
  asinlaboptions.url = "http://www.asinlab.com/php/convertfromasin.php?asin_num=" + req.query.asin + "&id_type=UPC&bulk=false&x=false";

  //console.log(req.query.asin);

  request.get(asinlaboptions, function (error, response, body) {
    //console.log('error:', error); // Print the error if one occurred
    //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

    $ = cheerio.load(body);

    upcnum = $('#bulk > tbody > tr:nth-child(2) > td:nth-child(3)').text();

    //console.log('body:', upcnum); 

    brickseekoptions.form.upc = upcnum;
    brickseekoptions.form.sku = upcnum;

    request.post(brickseekoptions, function (error, response, body) {
      //console.log(body);
      $ = cheerio.load(body);

      storeinfo = {};
      stores = [];

      $("tr").each(function () {
        storeinfo = {};
        storeinfo.address = $(this).find('.store-address').html();
        storeinfo.distance = $(this).find('.store-distance').html();
        storeinfo.quantity = $(this).find('strong').html();
        storeinfo.price = $(this).find('.store-price-number').html();

        if (storeinfo.address !== null) {
          storeinfo.address = storeinfo.address.replace('<br>', ' ');
          storeinfo.price = storeinfo.price.replace('\n', '');
          storeinfo.price = storeinfo.price.replace(' *\n', '');
        }

        storeinfo.type = 'walmart';

        if (storeinfo.address !== null) {
          stores.push(storeinfo);
        }

      });

      stores.shift();
      res.json(stores);

    });

  });

});

app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});