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
       var zip = $("#searchBar").val();
       $('#storesList').append('<svg id="loadIcon" width="70%" height="70%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-eclipse"><path ng-attr-d="{{config.pathCmd}}" ng-attr-fill="{{config.color}}" stroke="none" d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#3f8fc5"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 51;360 50 51" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></path></svg>');
       $.get( "https://radiant-taiga-46129.herokuapp.com/api", {asin: asinNum, zip: zip} )
        .done(function( data ) {
          console.log( "Data Loaded: " + data );
          $("#loadIcon").remove();
          if (!data.length) {
            $("#storesTableBody").append('<tr><td><h3 class="store-adr">No results.</h3></td></tr>');
          }
          data.forEach(function(store) {
            console.log(store.address + " " + store.quantity);
            //$("#storesList").append("<p>"+store.address+" "+store.ditance+" "+store.quantity+" "+store.price+" "+store.type+"</p>");
            $("#storesTableBody").append('<tr><td><img src="'+store.type+'.png" alt="" class="img-fluid"></td><td valign="middle"><button type="button" class="btn btn-success store-btn">'+store.quantity+' in stock</button></td><td valign="middle"><button type="button" class="btn btn-info store-btn">'+store.price+'</button></td><td valign="middle"><button type="button" class="btn btn-warning store-btn">'+store.distance.replace(/[^0-9\.]/g,"")+' miles</button></td></tr><tr><td colspan="4"><p class="store-adr">'+store.address+'</p></td></tr>');
         });
      });
    });

});
