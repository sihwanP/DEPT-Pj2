import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const category = req.query.category;

        let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id';
        const params: any[] = [];

        if (category) {
            query += ' WHERE c.name = ? OR p.category_id = ?';
            params.push(category, category);
        }

        query += ' ORDER BY p.created_at DESC';

        const [rows] = await pool.query<RowDataPacket[]>(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const searchProducts = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;
        const searchQuery = `%${q}%`;

        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.name LIKE ? OR p.description LIKE ?',
            [searchQuery, searchQuery]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getProductsByUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.user_id = ? ORDER BY p.created_at DESC',
            [userId]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error fetching products by user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, category, image_url, details, user_id } = req.body;

        // Find or create category
        let categoryId = null;
        if (category) {
            const [catRows] = await pool.query<RowDataPacket[]>('SELECT id FROM categories WHERE name = ?', [category]);
            if (catRows.length > 0) {
                categoryId = catRows[0].id;
            } else {
                const [result] = await pool.query<ResultSetHeader>('INSERT INTO categories (name) VALUES (?)', [category]);
                categoryId = result.insertId;
            }
        }

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO products (name, description, price, category_id, image_url, details, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, description, price, categoryId, image_url, JSON.stringify(details), user_id]
        );

        res.status(201).json({ id: result.insertId, message: 'Product created successfully' });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, image_url, details } = req.body;

        let categoryId = null;
        if (category) {
            const [catRows] = await pool.query<RowDataPacket[]>('SELECT id FROM categories WHERE name = ?', [category]);
            if (catRows.length > 0) {
                categoryId = catRows[0].id;
            } else {
                const [result] = await pool.query<ResultSetHeader>('INSERT INTO categories (name) VALUES (?)', [category]);
                categoryId = result.insertId;
            }
        }

        await pool.query(
            'UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, image_url = ?, details = ? WHERE id = ?',
            [name, description, price, categoryId, image_url, JSON.stringify(details), id]
        );

        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM products WHERE id = ?', [id]);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
