require('dotenv').config();
const mysql = require("mysql");
const { PrismaClient } = require('@prisma/client');

const databaseUrl = process.env.DATABASE_URL || (() => {
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 3306;
    const database = process.env.DB_NAME || 'raianny_loja';

    return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
})();

if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = databaseUrl;
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const prisma = globalThis.prisma ?? new PrismaClient();
globalThis.prisma = prisma;

pool.getConnection((err, connection) => {
    if (err) {
        console.error("Erro ao conectar ao MySQL:", err);
        return;
    }

    console.log("Conexão com MySQL estabelecida!");

    connection.release();
});

exports.pool = pool;
exports.prisma = prisma;