console.log("Ready from content.js!");
var asin_num = "B01LOP8EZC";

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if(msg.from == "popup.js"){
        console.log(msg.url);
        var url = msg.url;
        console.log(url);
        var url_split = url.split('/dp/')[1];
        console.log(url_split);
        console.log(url_split.substring(0, 10));
        asin_num = url_split.substring(0, 10);
        sendResponse({ASIN:asin_num});
    }
});
