import React, { useEffect, useState } from 'react';
import { AutoTranslatedText } from '../components/common/AutoTranslatedText';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, MapPin, Share2, X, CheckCircle2, CreditCard, Wallet, Loader2, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '../utils/i18nUtils';
import { getProductById } from '../api/products';
import { createBooking } from '../api/bookings';
import { FeaturedItem } from '../types';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/auth/LoginModal';
import { RequestPayResponse, RequestPayParams } from '../types/portone';

// Helper for date formatting
const formatDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};



export const DetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const [item, setItem] = useState<FeaturedItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [isBooking, setIsBooking] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'trans' | 'bank_transfer' | 'on_site' | null>(null);
    const [bookingStep, setBookingStep] = useState<'select' | 'confirm'>('select');
    const [activeMedia, setActiveMedia] = useState<'video' | 'image'>('image');
    const [downloading, setDownloading] = useState(false);

    // Update active media when item changes
    useEffect(() => {
        if (item?.videoUrl) {
            setActiveMedia('video');
        } else {
            setActiveMedia('image');
        }
    }, [item]);

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    useEffect(() => {
        const fetchItem = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await getProductById(id);
                setItem(data);
            } catch (error) {
                console.error('Failed to fetch product detail:', error);
            } finally {
                setLoading(false);
            }
        };

        window.scrollTo(0, 0);
        fetchItem();
    }, [id]);

    const handleShare = () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        setShowShareModal(true);
    };

    const handleShareSNS = (platform: 'facebook' | 'twitter' | 'more') => {
        if (!item) return;
        const url = window.location.href;
        const title = getLocalizedText(item.title, i18n.language); // Note: Simple string for sharing, not component if possible, or handle it differently. AutoTranslate hook returns value, but here we need string immediately. Sharing might use original fallback.

        switch (platform) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
                break;
            case 'more':
                if (navigator.share) {
                    navigator.share({ title, url }).catch(console.error);
                } else {
                    handleCopyLink();
                }
                break;
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    const requestPayment = (method: string, amount: number, name: string) => {
        if (!window.IMP) {
            alert("PortOne SDK is not loaded.");
            return;
        }
        const { IMP } = window;
        IMP.init('imp00000000'); // Test Store ID

        const data: RequestPayParams = {
            pg: 'html5_inicis',
            pay_method: method,
            merchant_uid: `mid_${new Date().getTime()}`,
            name: name,
            amount: amount,
            buyer_email: user?.email || 'test@test.com',
            buyer_name: user?.name || 'Guest',
            buyer_tel: '010-0000-0000',
        };

        IMP.request_pay(data, async (rsp: RequestPayResponse) => {
            if (rsp.success) {
                // Payment Success
                await processBookingAfterPayment(method);
            } else {
                // Payment Failed
                alert(`Payment failed: ${rsp.error_msg}`);
                setIsBooking(false);
            }
        });
    };

    const handleBankTransfer = async () => {
        if (!item || !id) return;
        setIsBooking(true);
        try {
            await processBookingAfterPayment('bank_transfer');
        } catch (error) {
            console.error(error);
        } finally {
            setIsBooking(false);
        }
    };

    const processBookingAfterPayment = async (method: string) => {
        if (!item || !id) return;

        try {
            const isDownloadable = activeMedia === 'video' || item.category === 'Style' || item.subcategory === 'Style';

            // Define initial status based on payment method and product category
            let initialStatus = 'pending'; // Default: Awaiting Approval (for non-Style)

            if (isDownloadable) {
                if (method === 'card' || method === 'trans') {
                    initialStatus = 'confirmed'; // Card/Realtime for Download: Immediate Approval
                } else if (method === 'bank_transfer') {
                    initialStatus = 'pending_payment'; // Bank for Download: Verifying Payment
                }
            } else {
                // For non-downloadable (Performance etc.)
                if (method === 'bank_transfer') {
                    initialStatus = 'pending_payment'; // Still verifying payment first
                } else {
                    initialStatus = 'pending'; // Card paid, but awaiting admin/owner approval for booking
                }
            }

            await createBooking({
                product_id: id,
                product_name: getLocalizedText(item.title, i18n.language),
                user_email: user?.email,
                payment_method: method,
                total_price: item.price as any,
                status: initialStatus
            });

            if (isDownloadable && initialStatus === 'confirmed') {
                // Immediate download for confirmed card payments
                setShowBookingModal(false);
                proceedToDownload();
            } else {
                setBookingStep('confirm');
            }

        } catch (error) {
            console.error(error);
            alert('Booking failed after payment. Please contact support.');
        } finally {
            setIsBooking(false);
        }
    };

    const handleBooking = () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        if (item?.category !== 'Style' && !selectedDate) {
            alert(t('common.select_date', 'Please select a date first.'));
            return;
        }
        setBookingStep('select');
        setPaymentMethod(null);
        setShowBookingModal(true);
    };

    const confirmBooking = async () => {
        if (!paymentMethod || !item || !id) return;
        if (item.category !== 'Style' && !selectedDate) return;

        setIsBooking(true);

        // Parse price
        let amount = 0;
        const priceText = getLocalizedText(item.price, 'ko'); // Use KRW for payment
        if (typeof priceText === 'string') {
            amount = parseInt(priceText.replace(/[^0-9]/g, ''), 10);
        } else if (typeof priceText === 'number') {
            amount = priceText;
        }

        if (isNaN(amount) || amount === 0) {
            // Free or invalid price, direct booking
            await processBookingAfterPayment(paymentMethod);
            return;
        }

        if (paymentMethod === 'bank_transfer') {
            await handleBankTransfer();
            return;
        }

        requestPayment(paymentMethod, amount, getLocalizedText(item.title, i18n.language));
    };

    const proceedToDownload = async () => {
        if (!item) return;
        const url = activeMedia === 'video' ? (item.videoUrl || item.imageUrl) : item.imageUrl;
        if (!url) return;

        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            window.open(url, '_blank');
            return;
        }

        try {
            setDownloading(true);
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            const urlParts = url.split('/');
            const filename = urlParts[urlParts.length - 1].split('?')[0] || `download-${item.id}`;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
            window.open(url, '_blank');
        } finally {
            setDownloading(false);
        }
    };

    const handleDownload = () => {
        // Trigger payment flow for download
        handleBooking();
    };

    // Calendar Helper Functions
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-8 md:h-10 w-8 md:w-10" />);
        }

        const todayStr = formatDate(new Date());

        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(year, month, day);
            const dateStr = formatDate(dateObj);
            const isSelected = selectedDate === dateStr;
            const isClosed = item?.closedDays?.includes(dateStr);
            const isPast = dateStr < todayStr;
            const isDisabled = isClosed || isPast;

            let bgClass = "bg-white/5 hover:bg-white/10 text-white";
            if (isSelected) bgClass = "bg-dancheong-red text-white font-bold shadow-lg scale-105";
            else if (isDisabled) bgClass = "bg-white/5 text-white/20 cursor-not-allowed";

            days.push(
                <button
                    key={day}
                    onClick={() => !isDisabled && setSelectedDate(dateStr)}
                    disabled={isDisabled}
                    className={`h-8 md:h-10 w-8 md:w-10 rounded-full flex items-center justify-center text-sm transition-all ${bgClass}`}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center text-white bg-charcoal">
                <div className="text-center">
                    <p>{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center text-white bg-charcoal">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">{t('common.item_not_found')}</h2>
                    <Link to="/" className="text-dancheong-red hover:underline">{t('common.back_home')}</Link>
                </div>
            </div>
        );
    }

    return (
        <article className="pt-20 min-h-screen bg-charcoal text-white">
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

            {/* Header / Hero */}
            <div className="relative h-[60vh] w-full group">
                {/* Main Media Display - Image Only */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                    style={{ backgroundImage: `url(${item.imageUrl})` }}
                >
                    <div className="absolute inset-0 bg-black/40" />
                </div>



                {/* Content Overlay */}
                <div className="absolute inset-x-0 top-0 bottom-16 z-20 pointer-events-none">
                    <div className="container mx-auto px-6 h-full flex flex-col justify-end">
                        <Link to="/" className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors pointer-events-auto">
                            <ArrowLeft size={20} className="mr-2" />
                            {t('common.back')}
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="pointer-events-auto"
                        >
                            <div className="inline-block border-b-2 border-dancheong-red mb-4 pb-1">
                                <span className="text-xl font-serif font-bold tracking-wider">
                                    {(() => {
                                        const displayKey = item.subcategory || item.category;
                                        return t(`nav.${displayKey.toLowerCase()}`) || displayKey;
                                    })()}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4"><AutoTranslatedText text={getLocalizedText(item.title, i18n.language)} /></h1>

                            <div className="flex flex-wrap gap-6 text-white/80 text-sm">
                                <div className="flex items-center">
                                    <CalendarIcon size={16} className="mr-2 text-dancheong-green" />
                                    <AutoTranslatedText text={getLocalizedText(item.date, i18n.language)} />
                                </div>
                                <div className="flex items-center">
                                    <MapPin size={16} className="mr-2 text-dancheong-green" />
                                    <AutoTranslatedText text={getLocalizedText(item.location, i18n.language)} />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent h-[40%] mt-auto" />
            </div>

            {/* Content Body */}
            <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h3 className="text-2xl font-bold font-serif mb-6 border-l-4 border-dancheong-green pl-4">{t('common.detail_intro')}</h3>
                        <p className="text-lg leading-relaxed text-white/80 whitespace-pre-line min-h-[500px]">
                            <AutoTranslatedText text={getLocalizedText(item.description, i18n.language)} />
                        </p>
                    </section>
                </div>

                {/* Sidebar / CTA - Sticky */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        {/* Price Card */}
                        <div className="bg-[#2a2a2a] p-6 rounded-xl border border-white/5 shadow-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-white/60">{t('common.price')}</span>
                                <span className="text-xl font-bold text-dancheong-red">
                                    {(() => {
                                        const priceText = getLocalizedText(item.price, i18n.language);
                                        const displayPrice = /^[0-9,]+$/.test(priceText) ? `${priceText}원` : priceText;
                                        return <AutoTranslatedText text={displayPrice} />;
                                    })()}
                                </span>
                            </div>
                        </div>

                        {/* Calendar - Hide for Style category */}
                        {item.category !== 'Style' && (
                            <div className="bg-[#2a2a2a] p-6 rounded-xl border border-white/5 shadow-2xl">
                                <h4 className="text-lg font-bold mb-4 flex items-center">
                                    <CalendarIcon size={18} className="mr-2 text-dancheong-green" />
                                    {t('common.select_date', 'Select Date')}
                                </h4>

                                <div className="flex justify-between items-center mb-4">
                                    <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded-full"><ChevronLeft size={20} /></button>
                                    <span className="font-bold">{currentDate.getFullYear()}. {currentDate.getMonth() + 1}</span>
                                    <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded-full"><ChevronRight size={20} /></button>
                                </div>

                                <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs text-white/40 font-bold uppercase">
                                    <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                                </div>
                                <div className="grid grid-cols-7 gap-2 place-items-center">
                                    {renderCalendar()}
                                </div>

                                {selectedDate && (
                                    <div className="mt-4 p-3 bg-dancheong-red/10 border border-dancheong-red/20 rounded-lg text-center">
                                        <span className="text-sm text-dancheong-red font-bold">
                                            Selected: {selectedDate}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="bg-[#2a2a2a] p-6 rounded-xl border border-white/5 shadow-2xl">


                            {item.category === 'Style' ? (
                                <button
                                    onClick={handleDownload}
                                    disabled={downloading}
                                    className="w-full py-4 rounded-lg font-bold text-lg mb-4 transition-all shadow-lg flex items-center justify-center bg-dancheong-green hover:bg-green-700 text-white"
                                >
                                    {downloading ? (
                                        <Loader2 size={24} className="animate-spin mr-2" />
                                    ) : (
                                        <Download size={24} className="mr-2" />
                                    )}
                                    {t('common.download')}
                                </button>
                            ) : (
                                <button
                                    onClick={handleBooking}
                                    disabled={!selectedDate}
                                    className={`w-full py-4 rounded-lg font-bold text-lg mb-4 transition-all shadow-lg flex items-center justify-center ${selectedDate
                                        ? 'bg-dancheong-red hover:bg-red-700 text-white'
                                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                                        }`}
                                >
                                    {t('common.booking')}
                                </button>
                            )}

                            <button
                                onClick={handleShare}
                                className="w-full bg-transparent border border-white/20 hover:bg-white/5 text-white py-3 rounded-lg font-medium transition-colors flex justify-center items-center"
                            >
                                <Share2 size={18} className="mr-2" />
                                {t('common.share')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setShowShareModal(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-[#1a1a1a] border border-white/10 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Share2 size={20} className="text-white/60" />
                                    <h2 className="text-lg font-bold">{t('common.share_modal.title')}</h2>
                                </div>
                                <button
                                    onClick={() => setShowShareModal(false)}
                                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-6 space-y-8">
                                {/* Preview Card */}
                                <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/5 group">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-sm truncate mb-1 text-white">
                                            {getLocalizedText(item.title, i18n.language)}
                                        </h3>
                                        <p className="text-white/40 text-[10px] truncate">
                                            {window.location.href}
                                        </p>
                                    </div>
                                    {/* QR Code - Inline Flow */}
                                    <div className="w-12 h-12 bg-white p-1 rounded-lg flex-shrink-0 shadow-lg">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}`}
                                            alt="QR Code"
                                            className="w-full h-full"
                                        />
                                    </div>
                                </div>

                                {/* Link Copy Section */}
                                <div className="space-y-2">
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold px-1">Share using link</p>
                                    <div className="flex bg-black/40 border border-white/10 rounded-xl overflow-hidden group">
                                        <div className="flex-1 p-4 overflow-hidden text-xs text-white/60 whitespace-nowrap mask-fade-right">
                                            {window.location.href}
                                        </div>
                                        <button
                                            onClick={handleCopyLink}
                                            className={`px-5 py-4 font-bold text-[10px] transition-all transform active:scale-95 whitespace-nowrap min-w-[80px] ${copySuccess
                                                ? 'bg-dancheong-green text-white'
                                                : 'bg-white/20 hover:bg-white/30 text-white border-l border-white/10'
                                                }`}
                                        >
                                            {copySuccess ? t('common.share_modal.copied') : t('common.share_modal.copy_link')}
                                        </button>
                                    </div>
                                </div>

                                {/* SNS Selection */}
                                <div className="space-y-3">
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold px-1">Share using apps</p>
                                    <div className="grid grid-cols-4 gap-4">
                                        {[
                                            { id: 'facebook', icon: 'f', bg: '#1877F2', label: t('common.share_modal.sns.facebook') },
                                            { id: 'twitter', icon: '𝕏', bg: '#000000', label: t('common.share_modal.sns.twitter'), font: 'serif' },
                                            { id: 'linkedin', icon: 'in', bg: '#0A66C2', label: 'LinkedIn' },
                                            { id: 'more', icon: '...', bg: 'rgba(255,255,255,0.1)', label: t('common.share_modal.sns.more') }
                                        ].map((sns) => (
                                            <div key={sns.id} className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => handleShareSNS(sns.id as any)}>
                                                <div
                                                    style={{ backgroundColor: sns.bg }}
                                                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)]"
                                                >
                                                    <span className={`font-bold text-xl ${sns.font === 'serif' ? 'font-serif' : ''}`}>{sns.icon}</span>
                                                </div>
                                                <span className="text-[10px] text-white/40 group-hover:text-white transition-colors">
                                                    {sns.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer / Tactile Bottom */}
                            <div className="h-6 bg-gradient-to-t from-white/5 to-transparent mt-4" />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Booking Modal */}
            <AnimatePresence>
                {showBookingModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setShowBookingModal(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-[#222] border border-white/10 w-full max-w-md p-8 rounded-2xl shadow-2xl"
                        >
                            <button
                                onClick={() => setShowBookingModal(false)}
                                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            {bookingStep === 'select' ? (
                                <>
                                    <h2 className="text-2xl font-bold mb-8 text-center">{t('common.payment.method')}</h2>

                                    {/* Order Summary in Modal */}
                                    <div className="bg-white/5 rounded-xl p-4 mb-6 text-sm">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-white/60">{t('common.product')}</span>
                                            <span className="font-bold">{getLocalizedText(item.title, i18n.language)}</span>
                                        </div>
                                        <div className="flex justify-between text-dancheong-red font-bold">
                                            <span>{t('common.date')}</span>
                                            <span>{selectedDate}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        {/* Credit Card - Available for All */}
                                        <button
                                            onClick={() => setPaymentMethod('card')}
                                            className={`w-full p-4 rounded-xl border transition-all flex items-center ${paymentMethod === 'card'
                                                ? 'bg-dancheong-red/20 border-dancheong-red text-dancheong-red'
                                                : 'bg-white/5 border-white/10 hover:border-white/20 text-white/80'
                                                }`}
                                        >
                                            <CreditCard className="mr-4" size={24} />
                                            <span className="font-medium">{t('common.payment.credit_card', 'Credit Card')}</span>
                                        </button>

                                        {/* Account Transfer - Only for Style (Photo/Video) */}
                                        {(item?.category === 'Style' || item?.subcategory === 'Style') && (
                                            <button
                                                onClick={() => setPaymentMethod('trans')}
                                                className={`w-full p-4 rounded-xl border transition-all flex items-center ${paymentMethod === 'trans'
                                                    ? 'bg-dancheong-green/20 border-dancheong-green text-dancheong-green'
                                                    : 'bg-white/5 border-white/10 hover:border-white/20 text-white/80'
                                                    }`}
                                            >
                                                <Wallet className="mr-4" size={24} />
                                                <span className="font-medium">{t('common.payment.realtime_transfer', 'Real-time Account Transfer')}</span>
                                            </button>
                                        )}

                                        {/* Bank Transfer (Manual) - New Requirement */}
                                        <button
                                            onClick={() => setPaymentMethod('bank_transfer')}
                                            className={`w-full p-4 rounded-xl border transition-all flex items-center ${paymentMethod === 'bank_transfer'
                                                ? 'bg-dancheong-green/20 border-dancheong-green text-dancheong-green'
                                                : 'bg-white/5 border-white/10 hover:border-white/20 text-white/80'
                                                }`}
                                        >
                                            <Wallet className="mr-4" size={24} />
                                            <div className="text-left">
                                                <span className="font-medium block">{t('common.payment.bank_transfer')}</span>
                                                {paymentMethod === 'bank_transfer' && (
                                                    <div className="mt-2 text-xs opacity-80 leading-tight">
                                                        <p>{t('common.payment.bank_name')}: 국민은행</p>
                                                        <p>{t('common.payment.account_number')}: 123-45678-90</p>
                                                        <p>{t('common.payment.account_holder')}: department</p>
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    </div>

                                    <button
                                        disabled={!paymentMethod || isBooking}
                                        onClick={confirmBooking}
                                        className="w-full bg-dancheong-red disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 text-white py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center shadow-lg"
                                    >
                                        {isBooking ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                                        {t('common.payment.confirm')}
                                    </button>
                                </>
                            ) : (
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-dancheong-green/20 text-dancheong-green rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">{t('common.payment.success')}</h2>
                                    <p className="text-white/60 mb-8">{t('common.payment.info')}</p>

                                    <div className="bg-white/5 rounded-xl p-6 text-left space-y-4 mb-8">
                                        <div>
                                            <p className="text-xs text-white/40 mb-1">{t('common.view_details')}</p>
                                            <p className="font-bold">{getLocalizedText(item.title, i18n.language)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/40 mb-1">{t('common.date')}</p>
                                            <p className="font-bold text-dancheong-red">{selectedDate}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/40 mb-1">{t('common.payment.method')}</p>
                                            <p className="font-medium">
                                                {paymentMethod === 'card' ? 'Credit Card' :
                                                    paymentMethod === 'trans' ? 'Account Transfer' :
                                                        paymentMethod}
                                            </p>
                                        </div>
                                        {/* Bank info removed as we use PG now */}
                                    </div>

                                    <button
                                        onClick={() => setShowBookingModal(false)}
                                        className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-lg font-bold text-lg transition-colors"
                                    >
                                        {t('common.payment.close')}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </article>
    );
};

export default DetailPage;
