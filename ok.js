var express = require('express');
var htmlConsole = require('./util/htmlConsole');

var app = new express();

var players = 0;

var singleCard = ['2','3','4','5','6','7','8','9','10','J','Q','K','A','￥','$'];
var wholePoker = [];

var player1 = [];
var player2 = [];
var player3 = [];

singleCard.forEach(function(card,i){
    for (i = 0; i <= 3; i++) {
        if (card !== '￥' && card !== '$') {
            wholePoker.push(card);
        }
    }
});
wholePoker.push('￥','$');

console.log(wholePoker);

app.get('/', function (req, res) {
    res.send(htmlConsole.makeConsoleBody(singleCard));
})
  
var server = app.listen(1215, function () {
  
   var host = server.address().address
   var port = server.address().port
  
   console.log("应用实例，访问地址为 http://%s:%s", host, port)
  
})