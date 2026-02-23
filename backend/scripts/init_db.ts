import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
};

async function initDB() {
    let connection;
    try {
        // Connect without database selected
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL server.');

        const dbName = process.env.DB_NAME || 'culture_store';

        // Create database if not exists
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        console.log(`Database '${dbName}' created or already exists.`);

        // Use the database
        await connection.query(`USE ${dbName}`);
        console.log(`Switched to database '${dbName}'.`);

        // Read and execute schema
        const schemaPath = path.resolve(__dirname, '../database/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolon and filter empty statements
        // Note: Simple split might break if semicolons are in strings, but for this schema it's fine.
        const statements = schemaSql
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0);

        for (const statement of statements) {
            await connection.query(statement);
        }
        console.log('Schema applied successfully.');

        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

initDB();
