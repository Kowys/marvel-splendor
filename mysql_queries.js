var mysql = require('mysql2');
// SQL stuff needs to live on the server, not the browser
// All SQL commands are to be kept on server itself
// If possible, logic should be executed on server, not browser

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

        // const assertDBQuery = 'CREATE DATABASE IF NOT EXISTS kowys_test'
        // conn.query(assertDBQuery, function (error, results, fields) {
        //     if (error) throw error;
        //     console.log("Database created");
        // });

        // conn.changeUser({database: "kowys_test"});
        
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
    assertDBAndTables,
    getCurrentPermCounter,
    incrementPermCounter
}