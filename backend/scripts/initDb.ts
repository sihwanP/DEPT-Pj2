import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const schemaPath = path.resolve(__dirname, '../database/schema.sql');

async function initDb() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        multipleStatements: true, // Allow multiple statements in one query
    });

    try {
        const sql = fs.readFileSync(schemaPath, 'utf8');
        console.log('Running schema.sql...');
        await connection.query(sql);
        console.log('✅ Database initialized successfully.');
    } catch (err) {
        console.error('❌ Failed to initialize database:', err);
    } finally {
        await connection.end();
    }
}

initDb();
