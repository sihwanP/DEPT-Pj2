import pool from './src/config/db';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function init() {
    try {
        console.log('Initializing database tables...');
        const sqlPath = path.join(__dirname, 'scripts', 'init_bookings.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split by semicolon and run each query
        const queries = sql.split(';').filter(q => q.trim().length > 0);

        for (const query of queries) {
            await pool.query(query);
            console.log('Executed query successfully.');
        }

        console.log('Database initialization completed.');
        process.exit(0);
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}

init();
