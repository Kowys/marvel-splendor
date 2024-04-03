const { url } = require('inspector');
var mysql = require('mysql2');
// SQL stuff needs to live on the server, not the browser
// All SQL commands are to be kept on server itself
// If possible, logic should be executed on server, not browser

const cardsJson = require('./public/javascripts/src/cards.json');

function createConn() {
    return mysql.createConnection({
        host: process.env.RDS_HOSTNAME,
        user: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        port: process.env.RDS_PORT,
        database: process.env.RDS_DB_NAME
    });
}

function assertDBAndTables(conn) {
    conn.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");

        var assertTableQuery = "CREATE TABLE IF NOT EXISTS counter (id INTEGER(255) PRIMARY KEY, count INTEGER(255));";
        conn.query(assertTableQuery, function (err, result) {
            if (err) throw err;
            console.log("Table created");
        });

        var insertTableQuery = "INSERT IGNORE INTO counter (id, count) VALUES(1, 0);";
        conn.query(insertTableQuery, function (err, result) {
            if (err) throw err;
            console.log("Row inserted");
        });

        var assertUrlTableQuery = "CREATE TABLE IF NOT EXISTS gameurls ( \
            table_id INT(10) ZEROFILL, \
            url_id VARCHAR(255) PRIMARY KEY, \
            player_id INT(10) \
        );";
        conn.query(assertUrlTableQuery, function (err, result) {
            if (err) throw err;
            console.log("Table created");
        });
    });
}

async function retrieveGameTable(conn, url_id) {
    return new Promise((resolve, reject) => {
        conn.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");

            var getGameTableQuery = "SELECT CONCAT('game', table_id) AS table_name, player_id FROM gameurls WHERE url_id = ?;";
            console.log(`URL id: ${url_id}`);
            conn.query(getGameTableQuery, url_id, function (err, result) {
                if (err) throw err;

                var table_name = result[0].table_name;
                var player_id = result[0].player_id;
                console.log(`table_name: ${table_name}`);

                var getGameDataQuery = "Select * FROM ?? WHERE round = (SELECT MAX(round) FROM ??) AND turn = (SELECT MAX(turn) FROM ?? WHERE round = (SELECT MAX(round) FROM ??))"
                conn.query(getGameDataQuery, [table_name, table_name, table_name, table_name], function (err, result) {
                    if (err) throw err;
                    console.log("Retrieved records from game table");
                    var gameData = result[0];
                    gameData.player_id = player_id;
                    gameData.table_name = table_name;
                    return resolve(gameData);
                });
            });
        });
    });
}

async function newGameTable(conn, uniqueUrls, numPlayers) {
    assertDBAndTables(conn);
    var nextGameId = await insertGameUrl(conn, uniqueUrls, numPlayers);
    createGameTable(conn, nextGameId, numPlayers);
}

async function insertGameUrl(conn, uniqueUrls, numPlayers) {
    return new Promise((resolve, reject) => {
        conn.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");

            var getNextGameIdQuery = "SELECT MAX(table_id) AS highest_id FROM gameurls;";
            conn.query(getNextGameIdQuery, function (err, result) {
                if (err) throw err;

                var nextGameId = result[0].highest_id + 1;
                var urlsAndGameIds = uniqueUrls.map((urlAndPlayerId) => [urlAndPlayerId[0], nextGameId, urlAndPlayerId[1]]);
                var insertUrlQuery = "INSERT INTO gameurls (url_id, table_id, player_id) VALUES ?;";
                conn.query(insertUrlQuery, [urlsAndGameIds], function (err, result) {
                    if (err) throw err;
                    console.log("Game URLs inserted");
                });
                return resolve(nextGameId);
            });
        });
    });
}

function createGameTable(conn, nextGameId, numPlayers) {
    conn.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");

        var getUrlQuery = "SELECT CONCAT('game', table_id) AS table_name FROM gameurls WHERE table_id = ?;";
        conn.query(getUrlQuery, nextGameId, function (err, result) {
            if (err) throw err;

            var table_name = result[0].table_name;
            console.log(`table_name: ${table_name}`);

            createGameTableColumns(conn, table_name);
            initGameTable(conn, table_name, numPlayers);
        });
    });
}

function createGameTableColumns(conn, table_name) {
    var createTableQuery = "CREATE TABLE IF NOT EXISTS ?? ( \
        game_state VARCHAR(255), num_players TINYINT, round INT, turn TINYINT, player_turn TINYINT, \
        board_currency_blue TINYINT, board_currency_red TINYINT, board_currency_yellow TINYINT, board_currency_purple TINYINT, board_currency_orange TINYINT, board_currency_shield TINYINT, \
        card_level_1_1 VARCHAR(255), card_level_1_2 VARCHAR(255), card_level_1_3 VARCHAR(255), card_level_1_4 VARCHAR(255), \
        card_level_2_1 VARCHAR(255), card_level_2_2 VARCHAR(255), card_level_2_3 VARCHAR(255), card_level_2_4 VARCHAR(255), \
        card_level_3_1 VARCHAR(255), card_level_3_2 VARCHAR(255), card_level_3_3 VARCHAR(255), card_level_3_4 VARCHAR(255), \
        location_1 VARCHAR(255), location_2 VARCHAR(255), location_3 VARCHAR(255), location_4 VARCHAR(255), \
        avengers_tile_player TINYINT, \
        player_1_currency_blue TINYINT, player_1_currency_red TINYINT, player_1_currency_yellow TINYINT, player_1_currency_purple TINYINT, player_1_currency_orange TINYINT, player_1_currency_shield TINYINT, \
        player_2_currency_blue TINYINT, player_2_currency_red TINYINT, player_2_currency_yellow TINYINT, player_2_currency_purple TINYINT, player_2_currency_orange TINYINT, player_2_currency_shield TINYINT, \
        player_3_currency_blue TINYINT, player_3_currency_red TINYINT, player_3_currency_yellow TINYINT, player_3_currency_purple TINYINT, player_3_currency_orange TINYINT, player_3_currency_shield TINYINT, \
        player_4_currency_blue TINYINT, player_4_currency_red TINYINT, player_4_currency_yellow TINYINT, player_4_currency_purple TINYINT, player_4_currency_orange TINYINT, player_4_currency_shield TINYINT, \
        player_1_cards TEXT, player_1_cards_reserved TEXT, \
        player_2_cards TEXT, player_2_cards_reserved TEXT, \
        player_3_cards TEXT, player_3_cards_reserved TEXT, \
        player_4_cards TEXT, player_4_cards_reserved TEXT, \
        previous_move_type VARCHAR(255), previous_move_info TEXT \
    )";
    conn.query(createTableQuery, table_name,  function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });
}

function initGameTable(conn, table_name, numPlayers) {
    var initTableQuery = "INSERT INTO ?? ( \
        game_state, num_players, round, turn, player_turn, \
        board_currency_blue, board_currency_red, board_currency_yellow, board_currency_purple, board_currency_orange, board_currency_shield, \
        card_level_1_1, card_level_1_2, card_level_1_3, card_level_1_4, \
        card_level_2_1, card_level_2_2, card_level_2_3, card_level_2_4, \
        card_level_3_1, card_level_3_2, card_level_3_3, card_level_3_4, \
        location_1, location_2, location_3, location_4, \
        avengers_tile_player, \
        player_1_currency_blue, player_1_currency_red, player_1_currency_yellow, player_1_currency_purple, player_1_currency_orange, player_1_currency_shield, \
        player_2_currency_blue, player_2_currency_red, player_2_currency_yellow, player_2_currency_purple, player_2_currency_orange, player_2_currency_shield, \
        player_3_currency_blue, player_3_currency_red, player_3_currency_yellow, player_3_currency_purple, player_3_currency_orange, player_3_currency_shield, \
        player_4_currency_blue, player_4_currency_red, player_4_currency_yellow, player_4_currency_purple, player_4_currency_orange, player_4_currency_shield, \
        player_1_cards, player_1_cards_reserved, player_2_cards, player_2_cards_reserved, player_3_cards, player_3_cards_reserved, player_4_cards, player_4_cards_reserved \
    ) VALUES ( \
        'active', ?, 1, 1, 1, \
        ?, ?, ?, ?, ?, ?, \
        ?, ?, ?, ?, \
        ?, ?, ?, ?, \
        ?, ?, ?, ?, \
        ?, ?, ?, ?, \
        0, \
        0, 0, 0, 0, 0, 0, \
        0, 0, 0, 0, 0, 0, \
        0, 0, 0, 0, 0, 0, \
        0, 0, 0, 0, 0, 0, \
        '', '', '', '', '', '', '', '' \
    )";

    var customValues = [table_name, numPlayers];
    var boardCurrencies = getInitialBoardCurrencies(numPlayers);
    var cards = getInitialCards(numPlayers);
    var gameTableValues = customValues.concat(boardCurrencies, cards);
    conn.query(initTableQuery, gameTableValues,  function (err, result) {
        if (err) throw err;
        console.log("Data inserted");
    });
}

function getInitialBoardCurrencies(numPlayers) {
    var currencyMap = {}
    currencyMap[1] = 4;
    currencyMap[2] = 4;
    currencyMap[3] = 5;
    currencyMap[4] = 7;
    var shieldAmt = 5;

    var colors = Array(5).fill(currencyMap[numPlayers])
    return colors.concat([shieldAmt]);
}

function getInitialCards(numPlayers) {
    var levelOneCards = [];
    var levelTwoCards = [];
    var levelThreeCards = [];
    var locationCards = [];
    cardsJson.cards.forEach(cardJson => {
        if (cardJson.level === 1) {
            levelOneCards.push(cardJson.name);
        } else 
        if (cardJson.level === 2) {
            levelTwoCards.push(cardJson.name);
        } else
        if (cardJson.level === 3) {
            levelThreeCards.push(cardJson.name);
        }
        if (cardJson.isLocation === true) {
            locationCards.push(cardJson.name);
        }
    });

    const shuffle = (array) => { 
        return array.sort(() => Math.random() - 0.5); 
    };

    levelOneCards = shuffle(levelOneCards);
    levelTwoCards = shuffle(levelTwoCards);
    levelThreeCards = shuffle(levelThreeCards);
    locationCards = shuffle(locationCards);

    var levelOneCardsInitial = levelOneCards.slice(0, 4);
    var levelTwoCardsInitial = levelTwoCards.slice(0, 4);
    var levelThreeCardsInitial = levelThreeCards.slice(0, 4);
    var locationCardsInitial = locationCards.slice(0, numPlayers);

    for (i = numPlayers; i < 4; i++) {
        locationCardsInitial.push("");
    };

    return levelOneCardsInitial.concat(levelTwoCardsInitial, levelThreeCardsInitial, locationCardsInitial);
}

function insertNewAction(conn, data) {
    var insertNewActionQuery = "INSERT INTO ?? ( \
        game_state, num_players, round, turn, player_turn, \
        board_currency_blue, board_currency_red, board_currency_yellow, board_currency_purple, board_currency_orange, board_currency_shield, \
        card_level_1_1, card_level_1_2, card_level_1_3, card_level_1_4, \
        card_level_2_1, card_level_2_2, card_level_2_3, card_level_2_4, \
        card_level_3_1, card_level_3_2, card_level_3_3, card_level_3_4, \
        location_1, location_2, location_3, location_4, \
        avengers_tile_player, \
        player_1_currency_blue, player_1_currency_red, player_1_currency_yellow, player_1_currency_purple, player_1_currency_orange, player_1_currency_shield, \
        player_2_currency_blue, player_2_currency_red, player_2_currency_yellow, player_2_currency_purple, player_2_currency_orange, player_2_currency_shield, \
        player_3_currency_blue, player_3_currency_red, player_3_currency_yellow, player_3_currency_purple, player_3_currency_orange, player_3_currency_shield, \
        player_4_currency_blue, player_4_currency_red, player_4_currency_yellow, player_4_currency_purple, player_4_currency_orange, player_4_currency_shield, \
        player_1_cards, player_1_cards_reserved, player_2_cards, player_2_cards_reserved, player_3_cards, player_3_cards_reserved, player_4_cards, player_4_cards_reserved, \
        previous_move_type, previous_move_info \
    ) VALUES ( \
        ?, ?, ?, ?, ?, \
        ?, ?, ?, ?, ?, ?, \
        ?, ?, ?, ?, \
        ?, ?, ?, ?, \
        ?, ?, ?, ?, \
        ?, ?, ?, ?, \
        ?, \
        ?, ?, ?, ?, ?, ?, \
        ?, ?, ?, ?, ?, ?, \
        ?, ?, ?, ?, ?, ?, \
        ?, ?, ?, ?, ?, ?, \
        ?, ?, ?, ?, ?, ?, ?, ?, \
        ?, ? \
    )";

    var gameStateValues = [
        data.table_name,
        data.game_state, data.num_players, data.round, data.turn, data.player_turn,
        data.board_currency_blue, data.board_currency_red, data.board_currency_yellow, data.board_currency_purple, data.board_currency_orange, data.board_currency_shield,
        data.card_level_1_1, data.card_level_1_2, data.card_level_1_3, data.card_level_1_4,
        data.card_level_2_1, data.card_level_2_2, data.card_level_2_3, data.card_level_2_4,
        data.card_level_3_1, data.card_level_3_2, data.card_level_3_3, data.card_level_3_4,
        data.location_1, data.location_2, data.location_3, data.location_4,
        data.avengers_tile_player
    ];

    // Player currencies
    for (var i = 1; i <= 4; i++) {
        var playerCurrencies = []
        if (`player_${i}_currency_blue` in data) {
            playerCurrencies.push(data[`player_${i}_currency_blue`]);
        } else {
            playerCurrencies.push(0);
        }
        if (`player_${i}_currency_red` in data) {
            playerCurrencies.push(data[`player_${i}_currency_red`]);
        } else {
            playerCurrencies.push(0);
        }
        if (`player_${i}_currency_yellow` in data) {
            playerCurrencies.push(data[`player_${i}_currency_yellow`]);
        } else {
            playerCurrencies.push(0);
        }
        if (`player_${i}_currency_purple` in data) {
            playerCurrencies.push(data[`player_${i}_currency_purple`]);
        } else {
            playerCurrencies.push(0);
        }
        if (`player_${i}_currency_orange` in data) {
            playerCurrencies.push(data[`player_${i}_currency_orange`]);
        } else {
            playerCurrencies.push(0);
        }
        if (`player_${i}_currency_shield` in data) {
            playerCurrencies.push(data[`player_${i}_currency_shield`]);
        } else {
            playerCurrencies.push(0);
        }

        gameStateValues = gameStateValues.concat(playerCurrencies);
    }

    // Player cards
    for (var i = 1; i <= 4; i++) {
        var playerBoughtCards = "";
        if (`player_${i}_cards` in data) {
            playerBoughtCards = data[`player_${i}_cards`];
        }
        var playerReservedCards = "";
        if (`player_${i}_cards_reserved` in data) {
            playerReservedCards = data[`player_${i}_cards_reserved`];
        }

        gameStateValues = gameStateValues.concat([playerBoughtCards, playerReservedCards]);
    }

    // Previous move
    gameStateValues = gameStateValues.concat([data.previous_move_type, data.previous_move_info]);

    conn.query(insertNewActionQuery, gameStateValues,  function (err, result) {
        if (err) throw err;
        console.log("New game action inserted");
    });
}

function getCurrentPermCounter(conn) {
    return new Promise((resolve, reject) => {
        const getPermCounterQuery = 'SELECT count FROM counter WHERE id = 1'
        conn.query(getPermCounterQuery, function (error, results, fields) {
            if (error) throw error;
            console.log(`Perm count: ${results[0].count}`);
            return resolve(results[0].count);
        });
    });
}

function incrementPermCounter(conn, i) {
    console.log(`Update amount: ${i}`)
    const incrementPermCounterQuery = `UPDATE counter SET count = count + ${i} WHERE id = 1`
    conn.query(incrementPermCounterQuery, function (error, results, fields) {
        if (error) throw error;
    });
}

module.exports = {
    createConn,
    newGameTable,
    retrieveGameTable,
    insertNewAction,
    getCurrentPermCounter,
    incrementPermCounter,
}