import React, { useEffect, useState } from 'react';
import { getBookings, BookingFilter, settleBooking, updateBookingStatus, deleteBooking } from '../../api/bookings';
import { AutoTranslatedText } from '../../components/common/AutoTranslatedText';
import { Search, CreditCard, Wallet, AlertCircle, CheckCircle2, DollarSign, XCircle, CheckCircle, Loader2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Booking {
    id: string;
    created_at: string;
    product_id: string;
    user_email: string;
    payment_method: string;
    status: string;
    total_price: any;
    settlement_status?: string;
    commission_amount?: number;
    settled_amount?: number;
    products: {
        title: any;
        category: string;
    };
}

const BookingListPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<BookingFilter>({
        status: 'all',
        payment_method: 'all',
        search: ''
    });
    const { t } = useTranslation();

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const data = await getBookings(filter);
            setBookings(data as any);
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [filter.status, filter.payment_method, filter.startDate, filter.endDate]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchBookings();
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        if (!confirm(`Are you sure you want to change status to ${status}?`)) return;
        try {
            await updateBookingStatus(id, status);
            await fetchBookings();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const handleSettle = async (id: string, amount: number) => {
        if (!confirm(t('admin.booking.settle_confirm'))) return;
        try {
            await settleBooking(id, amount);
            await fetchBookings();
        } catch (error) {
            alert(t('admin.booking.settle_error') || '정산 처리에 실패했습니다.');
        }
    };

    const handleDeleteBooking = async (id: string) => {
        if (!window.confirm(t('admin.booking.delete_confirm'))) return;
        try {
            // Optimistic update
            setBookings(prev => prev.filter(b => b.id !== id));

            await deleteBooking(id);

            // Brief delay for DB consistency
            await new Promise(resolve => setTimeout(resolve, 500));
            await fetchBookings();
        } catch (error: any) {
            console.error('Failed to delete booking:', error);
            alert(`Failed to delete booking: ${error.message || 'Unknown error'}`);
            // Re-fetch to restore state if delete failed
            fetchBookings();
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
            case 'completed':
                return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs flex items-center w-fit"><CheckCircle2 size={12} className="mr-1" /> {t('common.payment.confirmed') || '결제 완료'}</span>;
            case 'pending_payment':
                return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs flex items-center w-fit"><Loader2 size={12} className="mr-1 animate-spin" /> {t('common.payment.verifying') || '확인 중'}</span>;
            case 'pending':
                return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs flex items-center w-fit"><AlertCircle size={12} className="mr-1" /> {t('common.payment.waiting_approval') || '대기 중'}</span>;
            case 'cancelled':
                return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs flex items-center w-fit">{t('common.cancelled') || '취소됨'}</span>;
            default:
                return <span className="px-2 py-1 bg-white/10 text-white/60 rounded-full text-xs">{status === 'all' ? t('admin.booking.filter.all_status') : status}</span>;
        }
    };

    const getSettlementBadge = (status?: string) => {
        if (status === 'settled') {
            return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs flex items-center w-fit">{t('admin.booking.settled') || '정산 완료'}</span>;
        }
        return <span className="px-2 py-1 bg-white/5 text-white/40 rounded-full text-xs">{t('admin.booking.pending_settle') || '정산 대기'}</span>;
    };

    const getPaymentIcon = (method: string) => {
        switch (method) {
            case 'card':
                return <CreditCard size={16} className="text-blue-400" />;
            case 'trans':
            case 'bank_transfer':
                return <Wallet size={16} className="text-green-400" />;
            default:
                return <span className="text-xs text-white/40">{method}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-serif font-bold mb-8">{t('admin.booking.title')}</h1>

            {/* Filters */}
            <div className="bg-[#2a2a2a] p-4 rounded-xl border border-white/5 space-y-4">
                <div className="flex flex-wrap gap-4 items-end">
                    {/* Status Filter */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs text-white/40 mb-1">{t('admin.booking.filter.status')}</label>
                        <select
                            value={filter.status}
                            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-dancheong-red"
                        >
                            <option value="all">{t('admin.booking.filter.all_status')}</option>
                            <option value="confirmed">{t('common.payment.confirmed') || '결제 완료'}</option>
                            <option value="pending_payment">{t('common.payment.verifying') || '확인 중'}</option>
                            <option value="pending">{t('common.payment.waiting_approval') || '대기 중'}</option>
                            <option value="cancelled">{t('common.cancelled') || '취소됨'}</option>
                        </select>
                    </div>

                    {/* Payment Method Filter */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs text-white/40 mb-1">{t('admin.booking.filter.payment')}</label>
                        <select
                            value={filter.payment_method}
                            onChange={(e) => setFilter({ ...filter, payment_method: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-dancheong-red"
                        >
                            <option value="all">{t('admin.booking.filter.all_methods')}</option>
                            <option value="card">{t('common.card') || '신용카드'}</option>
                            <option value="trans">{t('common.bank_transfer') || '계좌이체'}</option>
                            <option value="bank_transfer">{t('common.payment.bank_transfer') || '무통장'}</option>
                        </select>
                    </div>

                    {/* Search */}
                    <div className="flex-[2] min-w-[300px]">
                        <label className="block text-xs text-white/40 mb-1">{t('admin.booking.filter.search')}</label>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="user@example.com"
                                value={filter.search}
                                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-dancheong-red"
                            />
                            <button type="submit" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white">
                                <Search size={20} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Date Range (Simplified) */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-xs text-white/40 mb-1">{t('admin.booking.filter.from')}</label>
                        <input
                            type="date"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm"
                            value={filter.startDate || ''}
                            onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs text-white/40 mb-1">{t('admin.booking.filter.to')}</label>
                        <input
                            type="date"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm"
                            value={filter.endDate || ''}
                            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#2a2a2a] rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5 text-white/60 text-sm">
                                <th className="p-4 font-medium">{t('admin.booking.table.date')}</th>
                                <th className="p-4 font-medium">{t('admin.user.table.user')}</th>
                                <th className="p-4 font-medium">{t('admin.booking.table.product')}</th>
                                <th className="p-4 font-medium">{t('admin.booking.table.payment')}</th>
                                <th className="p-4 font-medium text-right">{t('admin.booking.table.amount')}</th>
                                <th className="p-4 font-medium text-right">{t('admin.booking.table.settlement')}</th>
                                <th className="p-4 font-medium">{t('admin.booking.table.status')}</th>
                                <th className="p-4 font-medium">{t('admin.booking.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-white/40">{t('common.loading')}</td>
                                </tr>
                            ) : bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-white/40">{t('search.no_results')}</td>
                                </tr>
                            ) : (
                                bookings.map((booking: Booking) => {
                                    // Parse price safely (removing commas and non-numeric characters except decimals)
                                    const parsePrice = (price: any) => {
                                        if (typeof price === 'number') return price;
                                        if (!price) return 0;
                                        return Number(price.toString().replace(/[^0-9.-]+/g, ""));
                                    };

                                    const amount = parsePrice(booking.total_price);
                                    const settlementAmount = amount * 0.9;
                                    return (
                                        <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-sm text-white/60">
                                                {formatDate(booking.created_at)}
                                            </td>
                                            <td className="p-4 text-sm font-medium">
                                                {booking.user_email || t('common.guest')}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-sm">
                                                    <AutoTranslatedText text={typeof booking.products?.title === 'object' ? (booking.products.title as any).ko : booking.product_id} />
                                                </div>
                                                <div className="text-xs text-white/40">
                                                    {booking.products?.category || 'Unknown'}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    {getPaymentIcon(booking.payment_method)}
                                                    <span className="text-sm">
                                                        {t(`common.payment.${booking.payment_method}`) || booking.payment_method}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 font-bold text-dancheong-red text-right">
                                                {amount.toLocaleString()}원
                                            </td>
                                            <td className="p-4 font-bold text-dancheong-green text-right">
                                                {settlementAmount.toLocaleString()}원
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1">
                                                    {getStatusBadge(booking.status)}
                                                    {getSettlementBadge(booking.settlement_status)}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-2">
                                                    {(booking.status === 'pending' || booking.status === 'pending_payment') && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                                                className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded text-[10px] font-bold uppercase"
                                                                title="Approve"
                                                            >
                                                                <CheckCircle size={12} /> OK
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                                                className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-[10px] font-bold uppercase"
                                                                title="Cancel"
                                                            >
                                                                <XCircle size={12} /> NO
                                                            </button>
                                                        </div>
                                                    )}
                                                    {booking.status === 'confirmed' && booking.settlement_status !== 'settled' && (
                                                        <button
                                                            onClick={() => handleSettle(booking.id, amount)}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-dancheong-blue/20 text-dancheong-blue hover:bg-dancheong-blue/30 rounded-lg text-xs transition-colors"
                                                        >
                                                            <DollarSign size={14} /> {t('admin.booking.settle')}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteBooking(booking.id)}
                                                        className="flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-400/60 hover:bg-red-500/20 hover:text-red-400 rounded text-[10px] font-bold uppercase w-fit transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={12} /> {t('common.delete')}
                                                    </button>
                                                </div>
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

export default BookingListPage;
