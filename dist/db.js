import mysql from "mysql2/promise";
export default mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || '3306'), // Порт отдельно
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DBNAME,
    waitForConnections: true,
    connectionLimit: 10,
    multipleStatements: true, // Разрешаем несколько запросов в одном
});
//module.exports = pool;
