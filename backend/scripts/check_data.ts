import pool from '../src/config/db';
import { RowDataPacket } from 'mysql2';

async function checkData() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM products');
        const count = rows[0].count;
        console.log(`Product count: ${count}`);
        process.exit(0);
    } catch (error) {
        console.error('Error checking data:', error);
        process.exit(1);
    }
}

checkData();
