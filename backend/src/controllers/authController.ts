import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

export const register = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    try {
        // Check if user exists
        const [existingUsers] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await pool.query('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [email, hashedPassword, name]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Find user
        const [users] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate Token
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET || 'secret_key', // Fallback for dev
            { expiresIn: '1h' }
        );

        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
