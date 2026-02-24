import React, { useEffect } from 'react';
import { AutoTranslatedText } from '../common/AutoTranslatedText';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { FLOOR_CATEGORIES } from '../../data/mockData';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '../../utils/i18nParams';
import { Link } from 'react-router-dom';

interface FloorGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const FloorGuideModal: React.FC<FloorGuideModalProps> = ({ isOpen, onClose }) => {
    const { t, i18n } = useTranslation();

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Reverse floors to show 6F first (top to bottom)
    const reversedFloors = [...FLOOR_CATEGORIES].reverse();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#2a2a2a]">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-white">{t('floor_guide')}</h2>
                                <p className="text-white/60 text-sm mt-1">{t('floor_guide_subtitle')}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* List - Staircase Layout */}
                        <div className="overflow-y-auto p-6 space-y-4 custom-scrollbar lg:pl-12 lg:pr-24">
                            {reversedFloors.map((floor, index) => {
                                // Calculate margin left to create a staircase effect
                                const marginLeft = `${index * 40}px`;
                                
                                return (
                                    <Link
                                        key={floor.id}
                                        to={`/floor/${floor.id}`}
                                        onClick={onClose}
                                        className="block group relative"
                                        style={{ marginLeft }}
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center gap-6 p-4 md:p-5 rounded-2xl bg-[#222222] shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-white/5 hover:border-dancheong-red/50 hover:bg-[#2a2a2a] transition-all relative z-10 before:absolute before:-inset-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:rounded-2xl before:opacity-0 hover:before:opacity-100 before:transition-opacity"
                                        >
                                            {/* Step Connector Line */}
                                            {index !== reversedFloors.length - 1 && (
                                                <div className="absolute left-[2.2rem] top-[4.5rem] w-[2px] h-[3rem] bg-white/10 z-0 origin-top hidden md:block" />
                                            )}

                                            {/* Floor Number Label */}
                                            <div className="flex-shrink-0 relative">
                                                <div className="w-[70px] h-[70px] flex flex-col items-center justify-center bg-black/40 rounded-xl border border-white/10 group-hover:border-dancheong-red/30 transition-colors shadow-inner overflow-hidden">
                                                    <span className="text-[28px] font-bold text-white group-hover:text-dancheong-red transition-colors leading-none">
                                                        {floor.floor.replace('F', '')}
                                                    </span>
                                                    <span className="text-[11px] text-white/40 font-bold tracking-wider mt-1 uppercase">Floor</span>
                                                </div>
                                                <div className="absolute -inset-1 bg-gradient-to-tr from-dancheong-red/0 to-dancheong-red/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>

                                            {/* Floor Details */}
                                            <div className="flex-grow pr-4">
                                                <div className="flex items-center gap-3 mb-1.5">
                                                    <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-dancheong-red transition-colors">
                                                        <AutoTranslatedText text={getLocalizedText(floor.title, i18n.language)} />
                                                    </h3>
                                                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-white/40 text-[10px] uppercase font-bold tracking-widest border border-white/5 group-hover:border-dancheong-red/20 transition-colors">
                                                        Explore
                                                    </span>
                                                </div>
                                                <p className="text-sm text-white/60 line-clamp-1 leading-relaxed font-light group-hover:text-white/80 transition-colors">
                                                    <AutoTranslatedText text={getLocalizedText(floor.description, i18n.language)} />
                                                </p>
                                            </div>

                                            {/* Arrow Indicator */}
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-dancheong-red group-hover:text-white text-white/30 transition-all transform group-hover:translate-x-1 shadow-sm">
                                                <ChevronRight size={20} />
                                            </div>
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
