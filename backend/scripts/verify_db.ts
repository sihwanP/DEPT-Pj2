import pool from '../src/config/db';
import { RowDataPacket } from 'mysql2';

async function verify() {
    try {
        console.log('Verifying database connection...');
        const connection = await pool.getConnection();
        console.log('✅ Connected to database.');

        console.log('Checking tables...');
        const [tables] = await connection.query<RowDataPacket[]>('SHOW TABLES');
        const tableNames = tables.map((t: any) => Object.values(t)[0]);
        console.log('Tables found:', tableNames);

        const requiredTables = ['users', 'products', 'categories', 'orders'];
        const missing = requiredTables.filter(t => !tableNames.includes(t));

        if (missing.length > 0) {
            console.error('❌ Missing tables:', missing);
        } else {
            console.log('✅ All required tables exist.');
        }

        // Insert a dummy category and product if not exists
        console.log('Checking for products...');
        const [products] = await connection.query<RowDataPacket[]>('SELECT * FROM products LIMIT 1');

        if (products.length === 0) {
            console.log('Creating dummy data...');
            const [res] = await connection.query<any>('INSERT IGNORE INTO categories (name) VALUES (?)', ['Electronics']);
            const catId = res.insertId || (await connection.query<RowDataPacket[]>('SELECT id FROM categories WHERE name = ?', ['Electronics']))[0][0].id;

            await connection.query('INSERT INTO products (name, price, category_id, stock) VALUES (?, ?, ?, ?)', ['Smartphone', 999.99, catId, 10]);
            console.log('✅ Dummy product created.');
        } else {
            console.log('✅ Products exist.');
        }

        connection.release();
        console.log('Verification finished.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Verification failed:', error);
        process.exit(1);
    }
}

verify();
