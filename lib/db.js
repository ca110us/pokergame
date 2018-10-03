var dbHelper = require('./dbHelper');

exports.gameRecord = function(winner) {
    var sqlParamsEntity = [];
    var sql1 = "INSERT INTO `game_record` (`id`, `player`, `result`, `time`) VALUES (NULL, ?, ?, ?);";
    var param1 = [winner,1,Date.parse(new Date())];
    sqlParamsEntity.push(getNewSqlParamEntity(sql1, param1));

    switch (winner) {
        case 'player1':
            loser1 = 'player2';
            loser2 = 'player3'
            break; 
        case 'player2':
            loser1 = 'player1';
            loser2 = 'player3'
        break;
        case 'player3':
            loser1 = 'player1';
            loser2 = 'player2'
        break;
    }

    var sql2 = "INSERT INTO `game_record` (`id`, `player`, `result`, `time`) VALUES (NULL, ?, ?, ?);";
    var param2 = [loser1,0,Date.parse(new Date())];
    sqlParamsEntity.push(getNewSqlParamEntity(sql2, param2));

    var sql3 = "INSERT INTO `game_record` (`id`, `player`, `result`, `time`) VALUES (NULL, ?, ?, ?);";
    var param3 = [loser2,0,Date.parse(new Date())];
    sqlParamsEntity.push(getNewSqlParamEntity(sql3, param3));

    dbHelper.execTrans(sqlParamsEntity, function(err, info){
        if(err){
           console.error("Failure to record game.");
        }else{
           console.log("Add one game record.");
        }
    })
}

function getNewSqlParamEntity(sql, params, callback) {
    if (callback) {
        return callback(null, {
            sql: sql,
            params: params
        });
    }
    return {
        sql: sql,
        params: params
    };
}