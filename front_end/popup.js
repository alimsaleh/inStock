console.log("Ready from popup.js!");

$( document ).ready(function() {
    console.log( "doc ready!" );

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {from: "popup.js", subject:"getASIN", url:tabs[0].url}, function(response) {
        console.log(response.ASIN);
        $('#asinNum').text(response.ASIN);
      });
    });

    $('#searchBtn').click(function () {
       console.log("Im searching!");
       var asinNum = $('#asinNum').text();
       $.get( "https://radiant-taiga-46129.herokuapp.com/api", {asin: asinNum} )
        .done(function( data ) {
          console.log( "Data Loaded: " + data );
          data.forEach(function(store) {
            console.log(store.address + " " + store.quantity);
            //$("#storesList").append("<p>"+store.address+" "+store.ditance+" "+store.quantity+" "+store.price+" "+store.type+"</p>");
            $("#storesTableBody").append('<tr><td><img src="'+store.type+'.png" alt="" class="img-fluid"></td><td valign="middle"><button type="button" class="btn btn-success store-btn">'+store.quantity+' in stock</button></td><td valign="middle"><button type="button" class="btn btn-info store-btn">'+store.price+'</button></td><td valign="middle"><button type="button" class="btn btn-warning store-btn">'+store.distance.replace(/[^0-9\.]/g,"")+' miles</button></td></tr><tr><td colspan="4"><p class="store-adr">'+store.address+'</p></td></tr>');
         });
      });
    });

});
