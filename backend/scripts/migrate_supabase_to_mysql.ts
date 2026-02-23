import { createClient } from '@supabase/supabase-js';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const mysqlConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'culture_store',
};

async function migrate() {
    console.log('Starting migration...');
    const connection = await mysql.createConnection(mysqlConfig);

    try {
        // 1. Fetch Categories/Products from Supabase
        console.log('Fetching products from Supabase...');
        const { data: supabaseProducts, error } = await supabase
            .from('products')
            .select('*');

        if (error) throw error;
        console.log(`Found ${supabaseProducts.length} products in Supabase.`);

        // 2. Prepare Categories (Unique list from products)
        const categoryNames = [...new Set(supabaseProducts.map(p => p.category))];
        console.log(`Unique categories identified: ${categoryNames.join(', ')}`);

        // 3. Insert Categories into MySQL and get IDs
        const categoryMap: Record<string, number> = {};
        for (const name of categoryNames) {
            const [rows]: any = await connection.query(
                'INSERT INTO categories (name) VALUES (?) ON DUPLICATE KEY UPDATE name=name',
                [name]
            );

            // Get the ID (either newly inserted or existing)
            const [catRows]: any = await connection.query(
                'SELECT id FROM categories WHERE name = ?',
                [name]
            );
            categoryMap[name] = catRows[0].id;
        }

        // 4. Insert Products into MySQL
        for (const product of supabaseProducts) {
            const {
                title,
                description,
                category,
                image_url,
                price,
                video_url,
                date,
                location,
                closed_days
            } = product;

            // Simple mapping for common fields
            // Assuming title.ko or similar if it's JSON
            const name = typeof title === 'object' ? (title.ko || title.en || JSON.stringify(title)) : title;
            const desc = typeof description === 'object' ? (description.ko || description.en || JSON.stringify(description)) : description;

            // Handle price (Supabase price might be JSON like {min: 0, max: 100})
            let numericPrice = 0;
            if (typeof price === 'number') numericPrice = price;
            else if (typeof price === 'object' && price !== null) {
                numericPrice = price.min || price.amount || 0;
            }

            const details = JSON.stringify({
                original_title: title,
                original_description: description,
                date,
                location,
                closed_days,
                video_url
            });

            await connection.query(
                `INSERT INTO products (name, description, price, category_id, stock, image_url, details) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    name,
                    desc,
                    numericPrice,
                    categoryMap[category] || null,
                    100, // Default stock
                    image_url,
                    details
                ]
            );
            console.log(`Migrated product: ${name}`);
        }

        console.log('Migration completed successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await connection.end();
    }
}

migrate();
