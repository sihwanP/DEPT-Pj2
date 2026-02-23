import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CartPage: React.FC = () => {
    const { t } = useTranslation();

    // TODO: Implement cart logic (fetch from global state or API)
    const cartItems: any[] = [];

    return (
        <div className="min-h-screen bg-charcoal text-white pt-24 pb-12">
            <div className="container mx-auto px-6">
                <h1 className="text-3xl font-serif font-bold mb-8 border-b border-white/10 pb-4">
                    {t('common.cart', 'Shopping Cart')}
                </h1>

                {cartItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-white/5"
                    >
                        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6">
                            <ShoppingBag size={32} className="text-white/40" />
                        </div>
                        <h2 className="text-xl font-bold mb-2 text-white/80">{t('cart.empty', 'Your cart is empty')}</h2>
                        <p className="text-white/40 mb-8 max-w-sm text-center">
                            {t('cart.empty_desc', 'Looks like you haven\'t added any items to the cart yet.')}
                        </p>
                        <Link
                            to="/"
                            className="flex items-center gap-2 bg-dancheong-red hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-all hover:pr-8"
                        >
                            {t('cart.continue_shopping', 'Continue Shopping')}
                            <ChevronRight size={16} />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* TODO: Map through cart items */}
                            <p>Cart items will be listed here.</p>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <h3 className="text-lg font-bold mb-4">{t('cart.summary', 'Order Summary')}</h3>
                                {/* Summary details */}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
