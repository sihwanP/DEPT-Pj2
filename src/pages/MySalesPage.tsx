import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBookings, updateBookingStatus } from '../api/bookings';
import { AutoTranslatedText } from '../components/common/AutoTranslatedText';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MySalesPage: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [user, authLoading, navigate]);

    const fetchMySales = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await getBookings({ seller_id: user.id });
            setBookings(data || []);
        } catch (error) {
            console.error('Failed to fetch sales:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMySales();
    }, [user]);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        if (!confirm(`Are you sure you want to ${newStatus} this booking?`)) return;
        try {
            await updateBookingStatus(id, newStatus);
            fetchMySales(); // Refresh
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <span className="text-green-400 flex items-center gap-1"><CheckCircle size={14} /> Confirmed</span>;
            case 'cancelled':
                return <span className="text-red-400 flex items-center gap-1"><XCircle size={14} /> Cancelled</span>;
            case 'pending':
                return <span className="text-yellow-400 flex items-center gap-1"><AlertCircle size={14} /> Pending</span>;
            default:
                return <span className="text-white/60">{status}</span>;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-serif font-bold mb-8 text-white">My Sales</h1>

            <div className="bg-[#2a2a2a] rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5 text-white/60 text-sm">
                                <th className="p-4">Date</th>
                                <th className="p-4">Product</th>
                                <th className="p-4">Buyer</th>
                                <th className="p-4 text-right">Amount</th>
                                <th className="p-4 text-right">Est. Earnings (90%)</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-white">
                            {(loading || authLoading) ? (
                                <tr><td colSpan={7} className="p-8 text-center text-white/40"><Loader2 className="animate-spin text-dancheong-red mx-auto" /></td></tr>
                            ) : bookings.length === 0 ? (
                                <tr><td colSpan={7} className="p-8 text-center text-white/40">No sales yet.</td></tr>
                            ) : (
                                bookings.map((booking) => {
                                    const amount = Number(booking.total_price);
                                    const earnings = amount * 0.9;
                                    return (
                                        <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-sm text-white/60">
                                                {new Date(booking.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 font-medium">
                                                <AutoTranslatedText text={booking.products?.title} />
                                            </td>
                                            <td className="p-4 text-sm text-white/80">
                                                {booking.user_email}
                                            </td>
                                            <td className="p-4 text-right font-medium">
                                                {amount.toLocaleString()}원
                                            </td>
                                            <td className="p-4 text-right font-medium text-dancheong-green">
                                                {earnings.toLocaleString()}원
                                            </td>
                                            <td className="p-4">
                                                {getStatusBadge(booking.status)}
                                            </td>
                                            <td className="p-4">
                                                {booking.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                                            className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 text-xs transition-colors"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 text-xs transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                )}
                                                {booking.status === 'confirmed' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                                        className="px-3 py-1 bg-white/5 text-white/60 rounded-lg hover:bg-white/10 text-xs transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MySalesPage;
