import { createClient } from '@supabase/supabase-js';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const mysqlConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'business_management',
};

async function run() {
    console.log('--- Step 1: Initializing Schema ---');
    const connection = await mysql.createConnection({
        host: mysqlConfig.host,
        user: mysqlConfig.user,
        password: mysqlConfig.password
    });

    try {
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${mysqlConfig.database}`);
        await connection.query(`USE ${mysqlConfig.database}`);

        console.log('Cleaning up existing tables...');
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        const [tables]: any = await connection.query('SHOW TABLES');
        for (const tableRow of tables) {
            const tableName = Object.values(tableRow)[0];
            await connection.query(`DROP TABLE IF EXISTS ${tableName}`);
            console.log(`Dropped table: ${tableName}`);
        }
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        const schemaPath = path.resolve(__dirname, '../database/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        const statements = schemaSql.split(';').map(s => s.trim()).filter(s => s.length > 0);

        for (const statement of statements) {
            await connection.query(statement);
        }
        console.log('Schema initialized successfully.');

        console.log('\n--- Step 2: Migrating Data ---');
        const { data: supabaseProducts, error } = await supabase.from('products').select('*');
        if (error) throw error;
        console.log(`Found ${supabaseProducts.length} products in Supabase.`);

        const categoryNames = [...new Set(supabaseProducts.map(p => p.category))];
        const categoryMap: Record<string, number> = {};

        for (const name of categoryNames) {
            await connection.query('INSERT INTO categories (name) VALUES (?) ON DUPLICATE KEY UPDATE name=name', [name]);
            const [rows]: any = await connection.query('SELECT id FROM categories WHERE name = ?', [name]);
            categoryMap[name] = rows[0].id;
        }

        for (const product of supabaseProducts) {
            const name = typeof product.title === 'object' ? (product.title.ko || product.title.en || JSON.stringify(product.title)) : product.title;
            const desc = typeof product.description === 'object' ? (product.description.ko || product.description.en || JSON.stringify(product.description)) : product.description;

            let numericPrice = 0;
            if (typeof product.price === 'number') numericPrice = product.price;
            else if (typeof product.price === 'object' && product.price !== null) numericPrice = product.price.min || product.price.amount || 0;

            const details = JSON.stringify({
                original_title: product.title,
                original_description: product.description,
                date: product.date,
                location: product.location,
                closed_days: product.closed_days,
                video_url: product.video_url
            });

            await connection.query(
                `INSERT INTO products (name, description, price, category_id, stock, image_url, details) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [name, desc, numericPrice, categoryMap[product.category] || null, 100, product.image_url, details]
            );
            console.log(`Migrated: ${name}`);
        }

        console.log('\nMigration and Initialization finished successfully!');
    } catch (err) {
        console.error('Operation failed:', err);
    } finally {
        await connection.end();
    }
}

run();
