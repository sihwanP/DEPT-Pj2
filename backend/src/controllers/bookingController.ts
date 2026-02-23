import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getBookings = async (req: Request, res: Response) => {
    try {
        const { status, payment_method, search, startDate, endDate } = req.query;

        let query = `
            SELECT b.*, p.name as product_name, p.details as product_details 
            FROM bookings b 
            JOIN products p ON b.product_id = p.id
        `;
        const params: any[] = [];
        const conditions: string[] = [];

        if (status && status !== 'all') {
            conditions.push('b.status = ?');
            params.push(status);
        }

        if (payment_method && payment_method !== 'all') {
            conditions.push('b.payment_method = ?');
            params.push(payment_method);
        }

        if (search) {
            conditions.push('b.user_email LIKE ?');
            params.push(`%${search}%`);
        }

        if (startDate) {
            conditions.push('b.created_at >= ?');
            params.push(startDate);
        }

        if (endDate) {
            conditions.push('b.created_at <= ?');
            params.push(endDate);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY b.created_at DESC';

        const [rows] = await pool.query<RowDataPacket[]>(query, params);

        // Transform to match frontend expectations if necessary
        const transformedRows = rows.map(row => ({
            ...row,
            products: {
                title: JSON.parse(row.product_details || '{}').original_title || row.product_name,
                category: JSON.parse(row.product_details || '{}').category || ''
            }
        }));

        res.json(transformedRows);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createBooking = async (req: Request, res: Response) => {
    try {
        const { product_id, user_email, payment_method, total_price } = req.body;

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO bookings (product_id, user_email, payment_method, total_price) VALUES (?, ?, ?, ?)',
            [product_id, user_email, payment_method, total_price]
        );

        res.status(201).json({ id: result.insertId, message: 'Booking created successfully' });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Booking status updated successfully' });
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const settleBooking = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { total_price } = req.body;

        const commission_amount = total_price * 0.1; // 10% commission
        const settled_amount = total_price - commission_amount;

        await pool.query(
            'UPDATE bookings SET settlement_status = ?, commission_amount = ?, settled_amount = ?, settled_at = NOW() WHERE id = ?',
            ['settled', commission_amount, settled_amount, id]
        );

        res.json({ message: 'Booking settled successfully' });
    } catch (error) {
        console.error('Error settling booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteBooking = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
