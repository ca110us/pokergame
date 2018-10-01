exports.makeHtmlBody = function(message) {
    consoleBody = '<html>' +
    '<script>console.log("' + message + '");</script>'+
    '<script src="js/jquery-1.11.3.min.js"></script>'+
    '<body>' +
    '<input type="text" id="cards">  <br>' +
    '<button id="sendCardBtn" type="button">出牌</button>' +
    '</body>' +
    '<script src="js/sendCard.js"></script>'+
    '</html>'
    return consoleBody;
}