exports.makePoker = function(arr) {
    
    arr.sort(function(a,b){
        if (a>b) {
        return 1;
        }else if(a<b){
        return -1
        }else{
        return 0;
        }    
    });

    arr2 = arr.slice(0);

    arr2.forEach(function(card,i){
        switch (card) {
            case 11:
                arr2[i]='J'
                break;
            case 12:
                arr2[i]='Q'
                break;
            case 13:
                arr2[i]='K'
                break;
            case 14:
                arr2[i]='A'
                break;
            case 15:
                arr2[i]='2'
                break;
            case 16:
                arr2[i]='￥'
                break;
            case 17:
                arr2[i]='$'
                break;
        }
    });
    console.log(arr);
    return arr2;
}