var express = require('express');
var htmlConsole = require('./lib/htmlMaker');
var poker = require('./lib/poker');
var db = require('./lib/db')
var game = require('./lib/game')
var server = require('http').createServer();
var io = require('socket.io')(server);


game = new game();

game.gameInit();

var app = new express();


app.use(express.static('static'));

app.get('/', function (req, res) {
    if (game.players == 0) {
        res.send(htmlConsole.makeHtmlBody('player1'));
    }
    if (game.players == 1) {
        res.send(htmlConsole.makeHtmlBody('player2'));
    } 
    if (game.players == 2) {
        res.send(htmlConsole.makeHtmlBody('player3'));
    }
    if (game.players > 2) {
        res.send('too many people');
    }
    game.players++;
})

  
io.on('connection', function (socket) {
    var preparationHandler = function preparation() {
        if (game.status=='ready'||game.status=='gamming') {
            switch (game.players) {
                case 1:
                    socket.emit('receiveMessage','等待玩家1/3');
                    socket.broadcast.emit('receiveMessage','等待玩家1/3');
                    break;
                case 2:
                    socket.emit('receiveMessage','等待玩家2/3');
                    socket.broadcast.emit('receiveMessage','等待玩家2/3');
                    break;
                case 3:
                    socket.emit('receiveMessage','游戏开始！');
                    socket.broadcast.emit('receiveMessage','游戏开始！');
                    game.status = 'gamming';
                    socket.to(game.playerList['player1']).emit('receiveMessage', 'its your turn');
                    game.distributeCards();
                    socket.emit('receiveMessage',poker.makePokerByPowerlist(game.player3).join(','));
                    socket.to(game.playerList['player1']).emit('receiveMessage', poker.makePokerByPowerlist(game.player1).join(','));
                    socket.to(game.playerList['player2']).emit('receiveMessage', poker.makePokerByPowerlist(game.player2).join(','));
                    break;
                default:
                    break;
            }
        }
    }

    socket.on('disconnecting', (reason) => {
        var disconnectedPlayer = '';
        for (var player in game.playerList){
            if (game.playerList[player]==socket.id) {
                disconnectedPlayer = player;
                delete game.playerList[player];
            }
        }
        newPlayerList = JSON.parse(JSON.stringify(game.playerList));
        if (game.status=='gamming') {
            socket.broadcast.emit('receiveMessage', player + '由于意外断开，本局游戏结束，游戏不做记录，断线原因:' + reason);
        }
        game.gameInit();
        game.playerList = newPlayerList;
        game.players = Object.getOwnPropertyNames(newPlayerList).length;
        console.log(game.playerList);
        console.log(game.players);
        preparationHandler();
    });

    socket.on('bindSocket', function (data) {
        preparationHandler();
        game.playerList[data.player] = socket.id;
    });
    socket.on('outCards', function (data) {
        var outCardsHandle = function outCardsHandle(data,playerCards,nowPlayer,nextPlayer){
            if (game.lastTurn.nowPlayer!=nowPlayer) {
                socket.emit('receiveMessage','its not your turn');
            }
            if (game.lastTurn.nowPlayer==nowPlayer) {
                if (data.cards=='') {
                    game.lastTurn.nowPlayer=nextPlayer;
                    socket.emit('receiveMessage',data.player + ':give up');
                    socket.broadcast.emit('receiveMessage',data.player + ':give up');
                    socket.to(game.playerList[nextPlayer]).emit('receiveMessage', 'its your turn');
                }
                if (data.cards!='') {
                    if (poker.checkCards(data.cards,playerCards)==false) {
                        socket.emit('receiveMessage','illegalPoker');
                    }
                    if (poker.checkCards(data.cards,playerCards)!=false) {
                        cards = poker.checkCards(data.cards,playerCards);
                        if (poker.outCards(cards,game.lastTurn,data.player)==false) {
                            socket.emit('receiveMessage','illegalPoker');
                        }
                        if (poker.outCards(cards,game.lastTurn,data.player)!=false) {
                            poker.delCards(playerCards,cards.cards);
                            if (playerCards.length==0) {
                                socket.broadcast.emit('playerCards',data.player + ':' + poker.makePokerByPowerlist(cards.cards));
                                socket.emit('receiveMessage',data.player+ ':' + poker.makePokerByPowerlist(cards.cards));
                                socket.emit('receiveMessage','Game over!You win!');
                                socket.broadcast.emit('receiveMessage','Game over!' + nowPlayer + ' is the winner!');
                                game.status = 'over';
                                db.gameRecord(data.player);
                                game.gameInit();
                            }
                            if (playerCards.length!=0) {
                                socket.broadcast.emit('playerCards',data.player + ':' + poker.makePokerByPowerlist(cards.cards));
                                socket.emit('receiveMessage',data.player+ ':' + poker.makePokerByPowerlist(cards.cards));
                                socket.emit('receiveMessage',poker.makePokerByPowerlist(playerCards).join(','));
                                game.lastTurn.nowPlayer=nextPlayer;
                                socket.to(game.playerList[nextPlayer]).emit('receiveMessage', 'its your turn');
                                console.log(game.lastTurn);
                            }
                        }
                    }
                }
            }
        }

        if (data.player=='player1' && game.status=='gamming') {
            outCardsHandle(data,game.player1,'player1','player2')
        }
        if (data.player=='player2' && game.status=='gamming') {
            outCardsHandle(data,game.player2,'player2','player3')
        }
        if (data.player=='player3' && game.status=='gamming') {
            outCardsHandle(data,game.player3,'player3','player1')
        }
    });
});

server.listen(1214);

var pokerGame = app.listen(1215, function () {
  
   var host = pokerGame.address().address
   var port = pokerGame.address().port
  
   console.log("pokerGame by Edboffical http://%s:%s", host, port)
  
})