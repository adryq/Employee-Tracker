const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Luna1923',
    database: 'et'
});



module.exports = db;