var express = require('express');
var htmlConsole = require('./util/htmlMaker');
var poker = require('./util/poker');
// var webSocketServer = require('ws').Server;
var server = require('http').createServer();
var io = require('socket.io')(server);



var app = new express();

var players = 0;

var singleCard = [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];

var wholePoker = [];

var player1 = [];
var player2 = [];
var player3 = [];
var playerList = {};

var lastTurn = {player:'',cards:'',type:'',nowPlayer:'player1'};

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
        res.send(htmlConsole.makeHtmlBody(poker.makePoker(player2),'player2'));
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

// app.get('/sendCards', function (req, res) {

//     var response = {
//         "cards":req.query.cards,
//         "player":req.query.player
//     };
//     console.log(response);
//     res.end(JSON.stringify(response));
//  })
  
io.on('connection', function (socket) {
    // socket.broadcast.emit('user connected');//群发
    socket.on('bindSocket', function (data) {
        playerList[data.player] = socket.id;
        console.log(playerList);
    });
    socket.on('outCards', function (data) {
        // console.log(data);
        // if (lastTurn=='' && data.player!='player1') {
        //     socket.emit('receiveMessage','its not your turn');
        // }
        if (data.player=='player1') {
            if (lastTurn.nowPlayer!='player1' && lastTurn.player!='') {
                socket.emit('receiveMessage','its not your turn');
            }else{
                if (data.cards=='') {
                    lastTurn.nowPlayer='player2';
                    console.log(lastTurn);
                    socket.to(playerList['player2']).emit('receiveMessage', 'its your turn');
                }else{
                    if (poker.checkCards(data.cards,player1)==false) {
                        socket.emit('receiveMessage','illegalPoker');
                    }else{
                        // console.log(player1);
                        // socket.emit('receiveMessage',poker.checkCards(data.cards,player1));
                        cards = poker.checkCards(data.cards,player1);
                        if (poker.outCards(cards,lastTurn,data.player)==false) {
                            socket.emit('receiveMessage','illegalPoker');
                        }else{
                            poker.delCards(player1,cards.cards);
                            socket.broadcast.emit('playerCards',data.player + ':' + poker.makePoker(cards.cards));
                            socket.emit('receiveMessage',data.player+ ':' + poker.makePoker(cards.cards));
                            socket.emit('receiveMessage',poker.makePoker(player1).join(','));
                            lastTurn.nowPlayer='player2';
                            socket.to(playerList['player2']).emit('receiveMessage', 'its your turn');
                            console.log(lastTurn);
                        }
                    }
                }
            }
        }
        if (data.player=='player2') {
            if (lastTurn.nowPlayer!='player2') {
                socket.emit('receiveMessage','its not your turn');
            }else{
                if (data.cards=='') {
                    lastTurn.nowPlayer='player3';
                    socket.to(playerList['player3']).emit('receiveMessage', 'its your turn');
                    console.log(lastTurn);
                }else{
                    if (poker.checkCards(data.cards,player2)==false) {
                        socket.emit('receiveMessage','illegalPoker');
                    }else{
                        cards = poker.checkCards(data.cards,player2);
                        if (poker.outCards(cards,lastTurn,data.player)==false) {
                            socket.emit('receiveMessage','illegalPoker');
                        }else{
                            poker.delCards(player2,cards.cards);
                            socket.broadcast.emit('playerCards',data.player + ':' + poker.makePoker(cards.cards));
                            socket.emit('receiveMessage',data.player+ ':' + poker.makePoker(cards.cards));
                            socket.emit('receiveMessage',poker.makePoker(player2).join(','));
                            lastTurn.nowPlayer='player3';
                            socket.to(playerList['player3']).emit('receiveMessage', 'its your turn');
                            console.log(lastTurn);
                        }
                    }
                }
            } 
        }
        if (data.player=='player3') {
            if (lastTurn.nowPlayer!='player3') {
                socket.emit('receiveMessage','its not your turn');
            }else{
                if (data.cards=='') {
                    lastTurn.nowPlayer='player1';
                    socket.to(playerList['player1']).emit('receiveMessage', 'its your turn');
                    console.log(lastTurn);
                }else{
                    if (poker.checkCards(data.cards,player3)==false) {
                        socket.emit('receiveMessage','illegalPoker');
                    }else{
                        cards = poker.checkCards(data.cards,player3);
                        if (poker.outCards(cards,lastTurn,data.player)==false) {
                            socket.emit('receiveMessage','illegalPoker');
                        }else{
                            poker.delCards(player3,cards.cards);
                            socket.broadcast.emit('playerCards',data.player + ':' + poker.makePoker(cards.cards));
                            socket.emit('receiveMessage',data.player+ ':' + poker.makePoker(cards.cards));
                            socket.emit('receiveMessage',poker.makePoker(player3).join(','));
                            lastTurn.nowPlayer='player1';
                            socket.to(playerList['player1']).emit('receiveMessage', 'its your turn');
                            console.log(lastTurn);
                        }
                    }
                }
            }
        }
        // socket.broadcast.emit('playerCards',data);
    });
});
server.listen(1214);

var server = app.listen(1215, function () {
  
   var host = server.address().address
   var port = server.address().port
  
   console.log("应用实例，访问地址为 http://%s:%s", host, port)
  
})

// wss = new webSocketServer({ port: 8181 });
// wss.on('connection', function (ws) {
//     console.log('client connected');
//     ws.on('message', function (message) {
//         // console.log(message);
//         ws.send(message);
//     });
// });