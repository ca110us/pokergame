function game() { 
    var _this=this;
    this.gameInit = function() {
        _this.status = 'ready';
        _this.players = 0; 
        _this.powerList = [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
        _this.playerList = {};
        _this.pokerList = [];
        _this.player1 = [];
        _this.player2 = [];
        _this.player3 = [];
        _this.lastTurn = {player:'',cards:'',type:'',nowPlayer:'player1'}; 
        _this.powerList.forEach(function(card,i){
            for (i = 0; i < 4; i++) {
                if (card !== 16 && card !== 17) {
                    _this.pokerList.push(card);
                }
            }
        });
        _this.pokerList.push(16,17);
    }; 
    _this.distributeCards = function() { 
        for(i = 0; i < 18; i++){
            index = Math.floor((Math.random()*_this.pokerList.length));
            _this.player1.push(_this.pokerList[index]);
            _this.pokerList.splice(index,1);

            index = Math.floor((Math.random()*_this.pokerList.length));
            _this.player2.push(_this.pokerList[index]);
            _this.pokerList.splice(index,1);

            index = Math.floor((Math.random()*_this.pokerList.length));
            _this.player3.push(_this.pokerList[index]);
            _this.pokerList.splice(index,1);
        }
    }
}
module.exports = game;