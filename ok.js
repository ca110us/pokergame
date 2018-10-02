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

        var outCardsHandle = function outCardsHandle(data,playerCards,nowPlayer,nextPlayer){
            if (lastTurn.nowPlayer!=nowPlayer && lastTurn.player!='') {
                socket.emit('receiveMessage','its not your turn');
            }else{
                if (data.cards=='') {
                    lastTurn.nowPlayer=nextPlayer;
                    socket.emit('receiveMessage',data.player + ':give up');
                    socket.broadcast.emit('receiveMessage',data.player + ':give up');
                    socket.to(playerList[nextPlayer]).emit('receiveMessage', 'its your turn');
                }else{
                    if (poker.checkCards(data.cards,playerCards)==false) {
                        socket.emit('receiveMessage','illegalPoker');
                    }else{
                        // console.log(player1);
                        // socket.emit('receiveMessage',poker.checkCards(data.cards,player1));
                        cards = poker.checkCards(data.cards,playerCards);
                        if (poker.outCards(cards,lastTurn,data.player)==false) {
                            socket.emit('receiveMessage','illegalPoker');
                        }else{
                            poker.delCards(playerCards,cards.cards);
                            if (playerCards.length==0) {
                                socket.broadcast.emit('playerCards',data.player + ':' + poker.makePoker(cards.cards));
                                socket.emit('receiveMessage',data.player+ ':' + poker.makePoker(cards.cards));
                                socket.emit('receiveMessage','Game over!You win!');
                                socket.broadcast.emit('receiveMessage','Game over!' + nowPlayer + ' is the winner!');
                            }else{
                                socket.broadcast.emit('playerCards',data.player + ':' + poker.makePoker(cards.cards));
                                socket.emit('receiveMessage',data.player+ ':' + poker.makePoker(cards.cards));
                                socket.emit('receiveMessage',poker.makePoker(playerCards).join(','));
                                lastTurn.nowPlayer=nextPlayer;
                                socket.to(playerList[nextPlayer]).emit('receiveMessage', 'its your turn');
                                console.log(lastTurn);
                            }
                        }
                    }
                }
            }
        }

        if (data.player=='player1') {
            outCardsHandle(data,player1,'player1','player2')
        }
        if (data.player=='player2') {
            outCardsHandle(data,player2,'player2','player3')
        }
        if (data.player=='player3') {
            outCardsHandle(data,player3,'player3','player1')
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