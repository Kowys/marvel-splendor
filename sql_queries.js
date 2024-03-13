// SQL stuff needs to live on the server, not the browser
// All SQL commands are to be kept on server itself
// If possible, logic should be executed on server, not browser
// var sql = require('sqlite3');

function openDB() {
    return new sql.Database('./db/test.db', (err) => {
        if (err) {
            console.error(err.message);
        }
    });
}

function closeDB(db) {
    db.close((err) => {
        if (err) {
          console.error(err.message);
        }
    });
}

function assertDBAndTables() {
    var db = openDB();

    var assertTableQuery = "CREATE TABLE IF NOT EXISTS counter (id INTEGER PRIMARY KEY, count INTEGER, UNIQUE(id, count));";
    db.run(assertTableQuery, [], function (err, result) {
        if (err) throw err;
        var insertTableQuery = "INSERT OR IGNORE INTO counter (id, count) VALUES(1, 0);";
        db.run(insertTableQuery, [], function (err, result) {
            if (err) throw err;
        });
    });

    closeDB(db);
}

function getCurrentPermCounter() {
    var db = openDB();
    return new Promise((resolve, reject) => {
        const getPermCounterQuery = 'SELECT count FROM counter WHERE id = 1'
        db.all(getPermCounterQuery, function (error, results) {
            if (error) throw error;
            return resolve(results[0].count);
        });

        closeDB(db);
    });
}

function incrementPermCounter(i) {
    var db = openDB();
    console.log(`Update amount: ${i}`)
    const incrementPermCounterQuery = `UPDATE counter SET count = count + ${i} WHERE id = 1`
    db.run(incrementPermCounterQuery, function (error, results) {
        if (error) throw error;
    });
    closeDB(db);
}

module.exports = {
    openDB,
    assertDBAndTables,
    getCurrentPermCounter,
    incrementPermCounter
}