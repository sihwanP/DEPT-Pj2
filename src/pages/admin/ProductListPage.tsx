import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FeaturedItem } from '../../types';
import { getLocalizedText } from '../../utils/i18nUtils';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Plus } from 'lucide-react';
import { getFeaturedProducts, deleteProduct } from '../../api/products';

const ProductListPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [products, setProducts] = useState<FeaturedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { t, i18n } = useTranslation();

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getFeaturedProducts();
            setProducts(data);
        } catch (err: any) {
            console.error('Error fetching products:', err);
            setError(err.message || 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm(t('admin.product.delete_confirm'))) return;

        try {
            await deleteProduct(id);
            // Brief delay to ensure database consistency
            await new Promise(resolve => setTimeout(resolve, 500));
            // Refresh list
            fetchProducts();
        } catch (error: any) {
            console.error('Error deleting product:', error);
            alert(`Failed to delete product: ${error.message || 'Unknown error'}`);
        }
    };

    // Filter Logic
    const filteredProducts = products.filter(product => {
        // Search by Title (Korean as primary, but check all if needed, or just specific)
        // Since we strictly input Korean now, checking 'product.title.ko' is safest,
        // but 'getLocalizedText' handles fallback.
        const title = getLocalizedText(product.title, 'ko').toLowerCase(); // Search mostly by Korean title
        const matchesSearch = title.includes(searchTerm.toLowerCase());

        // Filter by Category
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const categoryLabels: Record<string, string> = {
        'All': '전체',
        'community': '커뮤니티',
        'popup': '팝업스토어',
        'collab': '콜라보레이션',
        'new': '신상품',
        'performance': '공연',
        'exhibition': '전시',
        'booking': '예매하기',
        'class': '클래스',
        'fashion': '스타일',
        'photo': '사진',
        'video': '영상',
        'media': '미디어',
        'local': '로컬 명소',
        'course': '추천 코스',
        'guide': '가이드',
        // New Floor Mappings
        'Trend': '트렌드 / 팝업 (1F)',
        'Performance': '공연 (2F)',
        'Exhibition': '전시 (2F)',
        'Art': '활동 / 스타일 (3F)',
        'Style': '사진 / 영상 (4F)',
        'Travel': '로컬 / 여행 (5F)',
        'Community': '커뮤니티'
    };

    const categories = Object.keys(categoryLabels);

    if (loading) return (
        <div className="flex justify-center items-center h-64 text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dancheong-red mr-3"></div>
            {t('common.loading')}
        </div>
    );

    if (error) return (
        <div className="text-center py-10">
            <p className="text-red-400 mb-4">{t('common.error')}: {error}</p>
            <button
                onClick={fetchProducts}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded transition-colors"
            >
                {t('common.retry') || 'Retry'}
            </button>
        </div>
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-white font-serif">{t('admin.product.title')}</h1>
                <Link
                    to="/admin/products/new"
                    className="bg-dancheong-red hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                    <Plus size={20} className="mr-2" />
                    {t('admin.product.add')}
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-[#2a2a2a] p-4 rounded-xl border border-white/5 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder={t('admin.product.search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-dancheong-red"
                    />
                </div>
                <div className="w-full md:w-48">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-dancheong-red"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat} className="bg-[#2a2a2a] text-white">{categoryLabels[cat]}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-[#2a2a2a] rounded-xl border border-white/5 overflow-hidden">
                <table className="w-full text-left text-white/80">
                    <thead className="bg-white/5 text-white uppercase text-xs font-bold">
                        <tr>
                            <th className="p-4">{t('admin.product.table.image')}</th>
                            <th className="p-4">{t('admin.product.table.title')}</th>
                            <th className="p-4">{t('admin.product.table.category')}</th>
                            <th className="p-4">{t('admin.product.table.price')}</th>
                            <th className="p-4 text-right">{t('admin.product.table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <img
                                        src={product.imageUrl}
                                        alt={getLocalizedText(product.title, i18n.language)}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                </td>
                                <td className="p-4 font-medium">
                                    {getLocalizedText(product.title, i18n.language)}
                                </td>
                                <td className="p-4">
                                    <span className="bg-white/10 px-2 py-1 rounded text-xs">
                                        {categoryLabels[product.category] || product.category}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {(() => {
                                        const text = getLocalizedText(product.price, i18n.language);
                                        if (!text) return '-';
                                        // If it's purely numeric (with optional commas), append '원'
                                        if (/^[0-9,]+$/.test(text)) {
                                            return `${text}원`;
                                        }
                                        return text;
                                    })()}
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <Link
                                        to={`/admin/products/${product.id}`}
                                        className="inline-block p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                                        title="Edit"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-white/40">
                                    {searchTerm || selectedCategory !== 'All'
                                        ? (t('search.no_results') || 'No products match your search filters.')
                                        : (t('featured.no_content') || 'No products found. Click "Add Product" to create one.')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductListPage;
