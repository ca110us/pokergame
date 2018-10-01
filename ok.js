var express = require('express');
var htmlConsole = require('./util/htmlMaker');
var poker = require('./util/poker');

var app = new express();

var players = 0;

var singleCard = [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];

var wholePoker = [];

var player1 = [];
var player2 = [];
var player3 = [];

singleCard.forEach(function(card,i){
    for (i = 0; i < 4; i++) {
        if (card !== 16 && card !== 17) {
            wholePoker.push(card);
        }
    }
});
wholePoker.push(16,17);

console.log(poker.makePoker(wholePoker));

app.use(express.static('static'));

app.get('/', function (req, res) {
    if (players == 0) {
        for(i = 0; i < 18; i++){
            index = Math.floor((Math.random()*wholePoker.length));
            player1.push(wholePoker[index]);
            wholePoker.splice(index,1);
        }
        res.send(htmlConsole.makeHtmlBody(poker.makePoker(player1),'player1'));
    }
    if (players == 1) {
        for(i = 0; i < 18; i++){
            index = Math.floor((Math.random()*wholePoker.length));
            player2.push(wholePoker[index]);
            wholePoker.splice(index,1);
        }
        res.send(htmlConsole.makeHtmlBody(poker.makePoker(player2),'plqyer2'));
    } 
    if (players == 2) {
        player3 = wholePoker;
        res.send(htmlConsole.makeHtmlBody(poker.makePoker(player3),'player3'));
    }
    if (players > 2) {
        res.send('too many people');
    }
    players++;
})

app.get('/sendCards', function (req, res) {

    var response = {
        "cards":req.query.cards,
        "player":req.query.player
    };
    console.log(response);
    res.end(JSON.stringify(response));
 })
  
var server = app.listen(1215, function () {
  
   var host = server.address().address
   var port = server.address().port
  
   console.log("应用实例，访问地址为 http://%s:%s", host, port)
  
})