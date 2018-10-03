isContained = function(large,small){
    largeArr =  large.slice(0);
    smallArr =  small.slice(0);
	var result = true;
	for(var i = smallArr.length - 1; i >= 0; i--){
		var index = largeArr.indexOf(smallArr[i]);
		if(index === -1){
			result = false;
			break;
		}else{
			largeArr.splice(index, 1);
		}
	}
	return result;
}

exports.makePokerByPowerlist = function(powerList) {
    
    powerList.sort(function(a,b){
        if (a>b) {
        return 1;
        }else if(a<b){
        return -1
        }else{
        return 0;
        }    
    });

    pokerList = powerList.slice(0);

    pokerList.forEach(function(card,i){
        switch (card) {
            case 10:
                pokerList[i]='T'
                break;
            case 11:
                pokerList[i]='J'
                break;
            case 12:
                pokerList[i]='Q'
                break;
            case 13:
                pokerList[i]='K'
                break;
            case 14:
                pokerList[i]='A'
                break;
            case 15:
                pokerList[i]='2'
                break;
            case 16:
                pokerList[i]='￥'
                break;
            case 17:
                pokerList[i]='$'
                break;
        }
    });
    // console.log(powerList);
    return pokerList;
}

exports.outCards = function(cards,lastTurn,player) {
    if (lastTurn.player==''||lastTurn.player==player) {
        lastTurn.player=player;
        lastTurn.type=cards.type;
        lastTurn.cards=cards.cards;
        return true;
    }
    if (cards.type!=lastTurn.type && cards.type!='zhadan' && cards.type!='wangzha') {
        return false;
    }else{
        if (cards.cards[0]>lastTurn.cards[0]&&cards.cards.length == lastTurn.cards.length) {
            lastTurn.player=player;
            lastTurn.type=cards.type;
            lastTurn.cards=cards.cards;
            return true;
        }
    }
    if (cards.type=='zhadan') {
        if (lastTurn.type=='wangzha') {
            return false;
        }
        if (lastTurn.type!='zhadan') {
            lastTurn.player=player;
            lastTurn.type=cards.type;
            lastTurn.cards=cards.cards;
            return true;
        }
        if (cards.cards[0]>lastTurn.cards[0]) {
            lastTurn.player=player;
            lastTurn.type=cards.type;
            lastTurn.cards=cards.cards;
            return true;
        }
    }
    if (cards.type=='wangzha') {
            lastTurn.player=player;
            lastTurn.type=cards.type;
            lastTurn.cards=cards.cards;
            return true;
    }
    return false;
}

exports.delCards = function(cards,delCards) {
	for(var i = delCards.length - 1; i >= 0; i--){
		var index = cards.indexOf(delCards[i]);
		if(index === -1){
			result = false;
			break;
		}else{
			cards.splice(index, 1);
		}
	}
}

exports.checkCards = function(cards,myCards) {
    pokerList = ['3','4','5','6','7','8','9','T','J','Q','K','A','2','￥','$'];
    powerList = [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
    cards = cards.split('');
    cards.forEach(function(card,i){
        rightPoker = false;
        for (j = 0; j < 18; j++) {
            if (card.toUpperCase()==pokerList[j]) {
                rightPoker = true;
                cards[i] = powerList[j];
            }
        }
    });

    cards.sort(function(a,b){
        if (a>b) {
        return 1;
        }else if(a<b){
        return -1
        }else{
        return 0;
        }    
    });

    if (!isContained(myCards,cards)) {
        // console.log(myCards);
        // console.log(cards);
        return false;
    }

    // console.log(cards + 'poser arr');

    if (rightPoker==true) {
        if (cards.length==1) {
            return {type:'danpai',cards:cards};
        }
        if (cards.length==2 && cards[0] == cards[1]) {
            return {type:'duizi',cards:cards};
        }
        if (cards.length==2 && cards[0]==16 && cards[1]==17) {
            return {type:'wangzha',cards:cards};
        }
        if (cards.length==3 && cards[0] == cards[1] && cards[2]==cards[0]) {
            return {type:'sanbudai',cards:cards};
        }
        if (cards.length==4 && cards[0] == cards[1] && cards[1]==cards[2]&& cards[3]==cards[0]) {
            return {type:'zhadan',cards:cards};
        }
        if (cards.length>4) {
            if (cards.every((card, i) => i === 0 || card === (cards[i-1] + 1))) {
                return {type:'shunzi',cards:cards};
            }
        }
        return false;
    }else{
        return false;
    }
}

