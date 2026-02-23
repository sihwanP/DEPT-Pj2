import React from 'react';
import { AutoTranslatedText } from '../common/AutoTranslatedText';
import { motion } from 'framer-motion';
import { FLOOR_CATEGORIES } from '../../data/mockData';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '../../utils/i18nParams';
import { Link } from 'react-router-dom';

export const FloorGuideSection: React.FC = () => {
    const { t, i18n } = useTranslation();

    return (
        <section className="py-24 bg-charcoal">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-sm font-bold tracking-widest text-dancheong-green mb-3 uppercase">{t('floor_guide_subtitle')}</h2>
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-white">{t('floor_guide')}</h3>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {FLOOR_CATEGORIES.map((floor, index) => (
                        <Link to={`/floor/${floor.id}`} key={floor.floor} className="block">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="group relative h-[500px] overflow-hidden rounded-lg cursor-pointer"
                            >
                                {/* Background Image with Zoom Effect */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${floor.bgImage})` }}
                                >
                                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-500" />
                                </div>

                                {/* Content */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                                    <div className="flex justify-between items-start">
                                        <span className="text-5xl font-serif font-bold text-white/20 group-hover:text-white/40 transition-colors">
                                            {floor.floor}
                                        </span>
                                        <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">
                                            <ArrowUpRight className="text-white" size={24} />
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-2xl font-bold text-white mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                            <AutoTranslatedText text={getLocalizedText(floor.title, i18n.language)} />
                                        </h4>
                                        <p className="text-white/80 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                            <AutoTranslatedText text={getLocalizedText(floor.description, i18n.language)} />
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
