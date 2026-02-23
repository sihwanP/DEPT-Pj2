import React, { useEffect, useState } from 'react';
import { getBookings, updateBookingStatus, deleteBooking, requestSettlement } from '../api/bookings';
import { getProductsByUser, deleteProduct } from '../api/products';
import { AutoTranslatedText } from '../components/common/AutoTranslatedText';
import { Loader2, Package, ShoppingBag, LayoutDashboard, Edit, Trash2, CheckCircle, XCircle, AlertCircle, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getLocalizedText } from '../utils/i18nUtils';

type TabType = 'bookings' | 'products' | 'sales';

const MyPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();


    const [activeTab, setActiveTab] = useState<TabType>('bookings');
    const [bookings, setBookings] = useState<any[]>([]);
    const [myProducts, setMyProducts] = useState<any[]>([]);
    const [sales, setSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            // Wait for auth to initialize
            return;
        }
        fetchData();
    }, [user, activeTab]);

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            if (activeTab === 'bookings') {
                const data = await getBookings({ buyer_email: user.email });
                setBookings(data || []);
            } else if (activeTab === 'products') {
                const data = await getProductsByUser(user.id);
                setMyProducts(data || []);
            } else if (activeTab === 'sales') {
                const data = await getBookings({ seller_id: user.id });
                setSales(data || []);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm(t('admin.product.product_delete_confirm'))) return;
        try {
            await deleteProduct(id);
            fetchData();
        } catch (error) {
            alert('Failed to delete product');
        }
    };

    const handleDeleteBooking = async (id: string) => {
        if (!window.confirm(t('admin.booking.delete_confirm'))) return;
        try {
            // Optimistic update
            setBookings(prev => prev.filter(b => b.id !== id));
            setSales(prev => prev.filter(s => s.id !== id));

            await deleteBooking(id);

            // Brief delay for DB consistency
            await new Promise(resolve => setTimeout(resolve, 500));
            fetchData();
        } catch (error: any) {
            console.error('Failed to delete booking:', error);
            alert(`Failed to delete booking: ${error.message || 'Unknown error'}`);
            fetchData();
        }
    };

    const handleRequestSettlement = async (id: string) => {
        try {
            await requestSettlement(id);
            alert(t('common.payment.settlement_requested'));
            fetchData();
        } catch (error) {
            alert('Failed to request settlement');
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        if (!window.confirm(`Are you sure you want to ${newStatus} this booking?`)) return;
        try {
            await updateBookingStatus(id, newStatus);
            // Brief delay for DB consistency
            await new Promise(resolve => setTimeout(resolve, 500));
            fetchData();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const getStatusBadge = (status: string, settlementStatus?: string) => {
        const badge = (() => {
            switch (status) {
                case 'confirmed':
                    return <span className="text-green-400 flex items-center gap-1 text-sm font-bold"><CheckCircle size={14} /> {t('common.payment.confirmed') || '승인 완료'}</span>;
                case 'pending_payment':
                    return <span className="text-blue-400 flex items-center gap-1 text-sm font-bold"><Loader2 size={14} className="animate-spin" /> {t('common.payment.verifying') || '결제 확인 중'}</span>;
                case 'pending':
                    return <span className="text-yellow-400 flex items-center gap-1 text-sm font-bold"><AlertCircle size={14} /> {t('common.payment.waiting_approval') || '승인 대기 중'}</span>;
                case 'cancelled':
                    return <span className="text-red-400 flex items-center gap-1 text-sm font-bold"><XCircle size={14} /> {t('common.cancelled') || 'Cancelled'}</span>;
                default:
                    return <span className="text-white/60">{status}</span>;
            }
        })();

        if (settlementStatus === 'settled') {
            return (
                <div className="flex flex-col gap-1 items-center">
                    {badge}
                    <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">{t('admin.booking.settled')}</span>
                </div>
            );
        }
        if (settlementStatus === 'requested') {
            return (
                <div className="flex flex-col gap-1 items-center">
                    {badge}
                    <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">{t('common.payment.settlement_requested')}</span>
                </div>
            );
        }

        return badge;
    };

    const proceedToDownload = async (item: any) => {
        const url = item.videoUrl || item.imageUrl;
        if (!url) return;
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            window.open(url, '_blank');
            return;
        }
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `download-${item.id}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            window.open(url, '_blank');
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center text-white bg-charcoal">
                <Loader2 className="animate-spin text-dancheong-red" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-charcoal text-white">
            <div className="container mx-auto px-4">
                <header className="mb-12">
                    <h1 className="text-4xl font-serif font-bold mb-2">{t('nav.mypage')}</h1>
                    <p className="text-white/40">{user.email}</p>
                </header>

                {/* Tabs */}
                <div className="flex border-b border-white/10 mb-8 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`px-6 py-4 font-medium transition-all relative ${activeTab === 'bookings' ? 'text-dancheong-red' : 'text-white/40 hover:text-white'}`}
                    >
                        <div className="flex items-center gap-2">
                            <ShoppingBag size={18} />
                            {t('common.view_details') || '예약 및 결제 내역'}
                        </div>
                        {activeTab === 'bookings' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-dancheong-red" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`px-6 py-4 font-medium transition-all relative ${activeTab === 'products' ? 'text-dancheong-red' : 'text-white/40 hover:text-white'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Package size={18} />
                            {t('admin.sidebar.products') || '등록한 상품'}
                        </div>
                        {activeTab === 'products' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-dancheong-red" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('sales')}
                        className={`px-6 py-4 font-medium transition-all relative ${activeTab === 'sales' ? 'text-dancheong-red' : 'text-white/40 hover:text-white'}`}
                    >
                        <div className="flex items-center gap-2">
                            <LayoutDashboard size={18} />
                            {t('admin.sidebar.bookings') || '판매 및 정산 내역'}
                        </div>
                        {activeTab === 'sales' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-dancheong-red" />}
                    </button>
                </div>

                {/* Content */}
                <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
                    {loading ? (
                        <div className="p-20 text-center"><Loader2 className="animate-spin text-dancheong-red mx-auto" size={32} /></div>
                    ) : (
                        <div className="overflow-x-auto">
                            {/* Helper to parse and format price */}
                            {(() => {
                                const parsePrice = (price: any) => {
                                    if (typeof price === 'number') return price;
                                    if (!price) return 0;
                                    const cleaned = price.toString().replace(/[^0-9.-]+/g, "");
                                    return Number(cleaned) || 0;
                                };

                                if (activeTab === 'bookings') {
                                    return (
                                        <table className="w-full text-left">
                                            <thead className="bg-white/5 text-white/40 text-xs uppercase tracking-wider font-bold">
                                                <tr>
                                                    <th className="px-6 py-4">{t('admin.booking.table.date')}</th>
                                                    <th className="px-6 py-4">{t('common.product')}</th>
                                                    <th className="px-6 py-4">{t('admin.booking.table.payment')}</th>
                                                    <th className="px-6 py-4 text-right">{t('common.price')}</th>
                                                    <th className="px-6 py-4 text-center">{t('admin.booking.table.status')}</th>
                                                    <th className="px-6 py-4 text-right">{t('admin.booking.table.actions')}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {bookings.length === 0 ? (
                                                    <tr><td colSpan={6} className="px-6 py-12 text-center text-white/20">{t('common.no_content')}</td></tr>
                                                ) : (
                                                    bookings.map(b => {
                                                        const isStyle = b.products?.category === 'Style';
                                                        return (
                                                            <tr key={b.id} className="hover:bg-white/5 transition-colors group">
                                                                <td className="px-6 py-4 text-sm text-white/40">{new Date(b.created_at).toLocaleDateString()}</td>
                                                                <td className="px-6 py-4 font-medium underline underline-offset-4 decoration-white/10 hover:decoration-dancheong-red transition-colors">
                                                                    <Link to={`/detail/${b.product_id}`}>
                                                                        <AutoTranslatedText text={b.product_name || getLocalizedText(b.products?.title, i18n.language)} />
                                                                    </Link>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-white/60">
                                                                    {t(`common.payment.${b.payment_method}`) || b.payment_method}
                                                                </td>
                                                                <td className="px-6 py-4 text-right font-bold text-dancheong-red">{parsePrice(b.total_price).toLocaleString()}원</td>
                                                                <td className="px-6 py-4 text-center">{getStatusBadge(b.status, b.settlement_status)}</td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <div className="flex justify-end gap-2">
                                                                        {isStyle && b.status === 'confirmed' && (
                                                                            <button
                                                                                onClick={() => proceedToDownload(b.products)}
                                                                                className="px-3 py-1 bg-dancheong-green/20 text-dancheong-green hover:bg-dancheong-green/30 rounded text-xs font-bold transition-colors"
                                                                            >
                                                                                Download
                                                                            </button>
                                                                        )}
                                                                        {b.status === 'pending' && (
                                                                            <button onClick={() => handleStatusUpdate(b.id, 'cancelled')} className="p-1.5 hover:bg-red-500/10 text-white/20 hover:text-red-400 rounded transition-colors" title="Cancel Booking">
                                                                                <XCircle size={14} />
                                                                            </button>
                                                                        )}
                                                                        <button onClick={() => handleDeleteBooking(b.id)} className="p-1.5 hover:bg-white/10 text-white/20 hover:text-white rounded transition-colors" title="Delete from list">
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                )}
                                            </tbody>
                                        </table>
                                    );
                                }

                                if (activeTab === 'products') {
                                    return (
                                        <table className="w-full text-left">
                                            <thead className="bg-white/5 text-white/40 text-xs uppercase tracking-wider font-bold">
                                                <tr>
                                                    <th className="px-6 py-4">{t('admin.product.table.title')}</th>
                                                    <th className="px-6 py-4">{t('admin.product.table.category')}</th>
                                                    <th className="px-6 py-4 text-right">{t('admin.product.table.price')}</th>
                                                    <th className="px-6 py-4 text-right">{t('admin.product.table.actions')}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {myProducts.length === 0 ? (
                                                    <tr><td colSpan={4} className="px-6 py-12 text-center text-white/20">{t('common.no_content')}</td></tr>
                                                ) : (
                                                    myProducts.map(p => (
                                                        <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                                                            <td className="px-6 py-4 font-medium flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded bg-white/5 overflow-hidden border border-white/10 flex-shrink-0">
                                                                    <img src={p.imageUrl} className="w-full h-full object-cover" />
                                                                </div>
                                                                <AutoTranslatedText text={getLocalizedText(p.title, i18n.language)} />
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-white/60">{p.category}</td>
                                                            <td className="px-6 py-4 text-right font-medium text-dancheong-red">
                                                                {parsePrice(getLocalizedText(p.price, i18n.language)).toLocaleString()}원
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Link to={`/products/${p.id}/edit`} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white" title={t('admin.product.edit')}>
                                                                        <Edit size={16} />
                                                                    </Link>
                                                                    <button onClick={() => handleDeleteProduct(p.id)} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-white/40 hover:text-red-400" title={t('admin.product.delete')}>
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-4">
                                                        <Link to="/products/new" className="inline-flex items-center gap-2 text-dancheong-red hover:underline text-sm font-bold">
                                                            + {t('admin.product.add')}
                                                        </Link>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    );
                                }

                                if (activeTab === 'sales') {
                                    return (
                                        <table className="w-full text-left">
                                            <thead className="bg-white/5 text-white/40 text-xs uppercase tracking-wider font-bold">
                                                <tr>
                                                    <th className="px-6 py-4">{t('admin.booking.table.date')}</th>
                                                    <th className="px-6 py-4">{t('common.product')}</th>
                                                    <th className="px-6 py-4">{t('admin.booking.table.user')}</th>
                                                    <th className="px-6 py-4 text-right">{t('common.price')}</th>
                                                    <th className="px-6 py-4 text-center">{t('admin.booking.table.status')}</th>
                                                    <th className="px-6 py-4 text-right">{t('admin.booking.table.actions')}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {sales.length === 0 ? (
                                                    <tr><td colSpan={6} className="px-6 py-12 text-center text-white/20">{t('common.no_content')}</td></tr>
                                                ) : (
                                                    sales.map(s => (
                                                        <tr key={s.id} className="hover:bg-white/5 transition-colors group">
                                                            <td className="px-6 py-4 text-sm text-white/40 font-mono">{new Date(s.created_at).toLocaleDateString()}</td>
                                                            <td className="px-6 py-4 font-medium">
                                                                <AutoTranslatedText text={getLocalizedText(s.products?.title, i18n.language)} />
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-white/60">{s.user_email}</td>
                                                            <td className="px-6 py-4 text-right font-medium text-dancheong-red">
                                                                {parsePrice(s.total_price).toLocaleString()}원
                                                            </td>
                                                            <td className="px-6 py-4 text-center">{getStatusBadge(s.status, s.settlement_status)}</td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    {(s.status === 'pending' || s.status === 'pending_payment') && (
                                                                        <>
                                                                            <button onClick={() => handleStatusUpdate(s.id, 'confirmed')} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-green-500/30 transition-colors">Approve</button>
                                                                            <button onClick={() => handleStatusUpdate(s.id, 'cancelled')} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-red-500/30 transition-colors">Cancel</button>
                                                                        </>
                                                                    )}
                                                                    {s.status === 'confirmed' && (!s.settlement_status || s.settlement_status === 'none') && (
                                                                        <button
                                                                            onClick={() => handleRequestSettlement(s.id)}
                                                                            className="flex items-center gap-1 px-2 py-1 bg-dancheong-blue/20 text-dancheong-blue hover:bg-dancheong-blue/30 rounded text-[10px] font-bold uppercase transition-colors"
                                                                        >
                                                                            <DollarSign size={12} /> {t('common.payment.request_settle')}
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        onClick={() => handleDeleteBooking(s.id)}
                                                                        className="p-1.5 bg-red-500/10 text-red-400/60 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors"
                                                                        title="Delete history"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    );
                                }
                                return null;
                            })()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyPage;
