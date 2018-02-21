const express = require('express');
const app = express();
var request = require('request');
var cheerio = require("cheerio");
var qs = require('querystring');

var options = {
    url: 'http://www.asinlab.com/php/convertfromasin.php?asin_num=B071CV8CG2&id_type=UPC&bulk=false&x=false',
    headers: {
      'User-Agent': 'request',
      "Referer": "http://www.asinlab.com/asin-to-upc/"
    }
  };

  app.use(express.static(__dirname + '/View'));

app.listen(8000, () => {
    console.log('Server started!');
  });


  app.route('/api').get((req, res) => {
      options.url = "http://www.asinlab.com/php/convertfromasin.php?asin_num="+req.query.asin+"&id_type=UPC&bulk=false&x=false";
    console.log(req.query.asin);
    request.get(options, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    $ = cheerio.load(body);
    upcnum = $('#bulk > tbody > tr:nth-child(2) > td:nth-child(3)').text();
    console.log('body:', upcnum); 

    request.post({
        url:     'https://brickseek.com/walmart-inventory-checker/',
        form:    {search_method: 'upc',
		sku: upcnum,
		sort: 'distance',
		upc : upcnum,
        zip: 48174},
        headers : {
            'User-Agent': 'request',
            'Origin' : "https://brickseek.com",
            'Referer' : 'https://brickseek.com/walmart-inventory-checker/',
        }
      }, function(error, response, body){
        console.log(body);
        $ = cheerio.load(body);
        
        storeinfo = {};
        stores = [];
        
        $( "tr" ).each(function() {
              storeinfo = {};
              storeinfo.address = $( this ).find('.store-address').html();
              storeinfo.distance = $( this ).find('.store-distance').html();
              storeinfo.quantity = $( this ).find('strong').html();
              storeinfo.price = $( this ).find('.store-price-number').html();
              if (storeinfo.address !== null){
              storeinfo.address = storeinfo.address.replace('<br>', ' ');
              storeinfo.price = storeinfo.price.replace('\n', '');
              storeinfo.price = storeinfo.price.replace(' *\n', '');
              }
              storeinfo.type = 'walmart';
              stores.push(storeinfo);
          });
          res.send(stores);
      });

    });


  });

  app.get('/home',(req, res) => {
    res.sendFile(__dirname + '/index.html');
  });