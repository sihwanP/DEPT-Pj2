import React, { useEffect, useState } from 'react';
import { AutoTranslatedText } from '../common/AutoTranslatedText';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { getFeaturedProducts } from '../../api/products';
import { FeaturedItem } from '../../types';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '../../utils/i18nUtils';
import LoginModal from '../auth/LoginModal';
import { useAuth } from '../../context/AuthContext';

export const FeaturedSection: React.FC = () => {
    const [products, setProducts] = useState<FeaturedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate(); // We'll need this since we are replacing Link

    useEffect(() => {
        let mounted = true;

        const fetchProducts = async () => {
            console.log('FeaturedSection: Fetching products...');
            setError(null);
            setLoading(true);

            try {
                const data = await getFeaturedProducts();

                if (mounted) {
                    console.log('FeaturedSection: Successfully loaded', data?.length, 'products');
                    setProducts(data);
                }
            } catch (err: any) {
                const isAbortError = err?.name === 'AbortError' || err?.message?.includes('AbortError') || err?.message?.includes('signal is aborted');

                if (!isAbortError) {
                    console.error('FeaturedSection: Fetch error:', err);
                    if (mounted) {
                        setError(err.message || '데이터를 불러오지 못했습니다.');
                    }
                } else {
                    console.debug('FeaturedSection: Fetch aborted or component unmounted.');
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchProducts();
        return () => { mounted = false; };
    }, []);

    if (loading) {
        return (
            <section className="py-24 bg-[#2a2a2a] text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-dancheong-red"></div>
                    <div className="text-white/60">{t('common.loading')}</div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-24 bg-[#2a2a2a] text-center">
                <div className="max-w-md mx-auto px-6">
                    <div className="text-red-500 mb-4 font-bold">오류가 발생했습니다: {error}</div>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full transition-colors border border-white/20"
                    >
                        다시 시도
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-[#2a2a2a]">
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-sm font-bold tracking-widest text-dancheong-red mb-3 uppercase">Curation</h2>
                        <h3 className="text-3xl md:text-4xl font-serif font-bold text-white">{t('featured.title')}</h3>
                    </motion.div>

                    <Link
                        to="/all-products"
                        className="hidden md:block text-white/60 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
                    >
                        {t('common.view_all')}
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.slice(0, 15).map((item, index) => (
                        <Link to={`/detail/${item.id}`} key={item.id} className="block group">
                            <motion.div
                                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 100,
                                    damping: 20,
                                    delay: index * 0.1
                                }}
                                className="bg-charcoal rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={item.imageUrl}
                                        alt={getLocalizedText(item.title, i18n.language)}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white uppercase tracking-wider">
                                        {(() => {
                                            const displayKey = item.subcategory || item.category;
                                            return t(`nav.${displayKey.toLowerCase()}`) || displayKey;
                                        })()}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h4 className="text-xl font-bold text-white mb-2 group-hover:text-dancheong-red transition-colors">
                                        <AutoTranslatedText text={getLocalizedText(item.title, i18n.language)} />
                                    </h4>
                                    <p className="text-white/60 text-sm line-clamp-2 mb-4">
                                        <AutoTranslatedText text={getLocalizedText(item.description, i18n.language)} />
                                    </p>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-white/40">{t('common.view_details')}</span>
                                        <span className="w-8 h-[1px] bg-white/20 group-hover:bg-dancheong-red group-hover:w-12 transition-all duration-300"></span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {!loading && (products.length === 0 || products === null) && (
                    <div className="text-center py-20 bg-charcoal/50 rounded-2xl border border-white/5">
                        <p className="text-white/40 mb-4">{t('featured.no_content')}</p>
                        <button
                            onClick={() => {
                                if (!user) {
                                    setShowLoginModal(true);
                                } else {
                                    navigate('/products/new');
                                }
                            }}
                            className="inline-block bg-dancheong-red/20 hover:bg-dancheong-red/40 text-dancheong-red px-6 py-2 rounded-full transition-colors text-sm"
                        >
                            - {t('common.register_product')}
                        </button>
                    </div>
                )}

                <div className="mt-12 text-center md:hidden">
                    <Link
                        to="/all-products"
                        className="inline-block text-white/60 hover:text-white border border-white/20 px-6 py-3 rounded-full text-sm"
                    >
                        {t('common.view_all')}
                    </Link>
                </div>
            </div>
        </section>
    );
};
