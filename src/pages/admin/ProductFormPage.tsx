import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, useSearchParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { getProductById, createProduct, updateProduct } from '../../api/products';
import { LocalizedString } from '../../types';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, Upload, Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const initialLocalized: LocalizedString = {
    ko: '',
    en: '',
    ja: '',
    zh: ''
};

// Helper for date formatting
const formatDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const ProductFormPage: React.FC = () => {
    const { user } = useAuth();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const isEditMode = !!id;
    const isPublicMode = !location.pathname.startsWith('/admin');

    // Defaults from URL
    const defaultCategory = searchParams.get('category') || 'Trend';
    const defaultSubcategory = searchParams.get('subcategory') || '';

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);
    const [imageUploading, setImageUploading] = useState(false);
    const [videoUploading, setVideoUploading] = useState(false);

    // Form States
    const [title, setTitle] = useState<LocalizedString>({ ...initialLocalized });
    const [description, setDescription] = useState<LocalizedString>({ ...initialLocalized });
    const [category, setCategory] = useState(defaultCategory);
    const [subcategory, setSubcategory] = useState(defaultSubcategory);
    const [imageUrl, setImageUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [date, setDate] = useState<LocalizedString>({ ...initialLocalized });
    const [locationState, setLocationState] = useState<LocalizedString>({ ...initialLocalized }); // Renamed to avoid collision with useLocation
    const [price, setPrice] = useState<LocalizedString>({ ...initialLocalized });
    const [closedDays, setClosedDays] = useState<string[]>([]);

    // Calendar State
    const [currentCalDate, setCurrentCalDate] = useState(new Date());

    useEffect(() => {
        if (isEditMode && id) {
            const loadProduct = async () => {
                try {
                    const product = await getProductById(id);
                    if (product) {
                        setTitle(product.title);
                        setDescription(product.description);
                        setCategory(product.category);
                        // Subcategory is in details
                        setSubcategory((product as any).subcategory || '');
                        setImageUrl(product.imageUrl);
                        setVideoUrl(product.videoUrl || '');
                        setDate(product.date);
                        setLocationState(product.location);
                        setPrice(product.price);
                        setClosedDays(product.closedDays || []);
                    } else {
                        navigate(isPublicMode ? '/' : '/admin/products');
                    }
                } catch (error: any) {
                    console.error('Failed to load product:', error);
                    alert(`상품 정보를 불러오는데 실패했습니다: ${error.message || '알 수 없는 오류'}`);
                    navigate(isPublicMode ? '/' : '/admin/products');
                } finally {
                    setFetching(false);
                }
            };
            loadProduct();
        } else {
            setFetching(false);
        }
    }, [id, isEditMode, isPublicMode, navigate]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        setImageUploading(true);
        try {
            const response = await api.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setImageUrl(response.data.url);
        } catch (error: any) {
            console.error('Error uploading image:', error);
            alert(`이미지 업로드 실패: ${error.response?.data?.message || error.message}`);
        } finally {
            setImageUploading(false);
            e.target.value = '';
        }
    };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        setVideoUploading(true);
        try {
            const response = await api.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setVideoUrl(response.data.url);
        } catch (error: any) {
            console.error('Error uploading video:', error);
            alert(`동영상 업로드 실패: ${error.response?.data?.message || error.message}`);
        } finally {
            setVideoUploading(false);
            e.target.value = '';
        }
    };

    const toggleClosedDay = (dateStr: string) => {
        setClosedDays(prev => {
            if (prev.includes(dateStr)) {
                return prev.filter(d => d !== dateStr);
            } else {
                return [...prev, dateStr].sort();
            }
        });
    };

    // Calendar Helper Functions
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const renderCalendar = () => {
        const year = currentCalDate.getFullYear();
        const month = currentCalDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];
        // Empty slots
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
        }

        const todayStr = formatDate(new Date());

        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(year, month, day);
            const dateStr = formatDate(dateObj);
            const isClosed = closedDays.includes(dateStr);
            const isPast = dateStr < todayStr;

            let bgClass = "bg-white/5 hover:bg-white/10 text-white";
            if (isClosed) bgClass = "bg-red-500 text-white font-bold shadow-lg";
            else if (isPast) bgClass = "bg-white/5 text-white/20"; // Just visual dimming, admins can still close past days if they want? Or maybe strictly future? Let's allow all for flexibility.

            days.push(
                <button
                    key={day}
                    type="button"
                    onClick={() => toggleClosedDay(dateStr)}
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm transition-all ${bgClass}`}
                    title={isClosed ? (t('admin.product.form.closed_day') || "Closed Day") : (t('admin.product.form.open_day') || "Open Day")}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    const nextMonth = () => setCurrentCalDate(new Date(currentCalDate.getFullYear(), currentCalDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentCalDate(new Date(currentCalDate.getFullYear(), currentCalDate.getMonth() - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const productData = {
            name: title.ko,
            description: description.ko,
            price: price.ko.replace(/[^0-9]/g, ''),
            category: category,
            image_url: imageUrl,
            user_id: user?.id,
            details: {
                original_title: title,
                original_description: description,
                subcategory,
                video_url: videoUrl,
                date: date,
                location: locationState,
                price: price,
                closed_days: closedDays
            }
        };

        try {
            if (isEditMode && id) {
                await updateProduct(id, productData);
            } else {
                await createProduct(productData);
            }

            // Brief delay to ensure database consistency before redirecting
            await new Promise(resolve => setTimeout(resolve, 500));
            navigate(isPublicMode ? `/${category.toLowerCase()}` : '/admin/products');
        } catch (error: any) {
            console.error('Error saving product:', error);
            alert(`Failed to save product: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleLocalizedChange = (
        setter: React.Dispatch<React.SetStateAction<LocalizedString>>,
        lang: string,
        value: string
    ) => {
        setter(prev => ({ ...prev, [lang]: value }));
    };

    if (fetching) return <div className="text-white p-8">{t('common.loading')}</div>;

    return (
        <div className="min-h-screen pt-24 pb-20 bg-charcoal text-white">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center mb-8">
                    <Link
                        to={isPublicMode ? `/${category.toLowerCase()}` : "/admin/products"}
                        className="text-white/60 hover:text-white mr-4 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-bold text-white font-serif">
                        {isEditMode ? t('admin.product.edit') : (isPublicMode ? t('common.register_product') : t('admin.product.add'))}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 bg-[#2a2a2a] p-8 rounded-xl border border-white/5">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-white/80 text-sm font-bold mb-2">{t('admin.product.form.image_label')}</label>
                        <div className="flex items-center space-x-4">
                            {imageUrl && (
                                <div className="relative group">
                                    <img src={imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-white/10" />
                                    <button
                                        type="button"
                                        onClick={() => setImageUrl('')}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Remove Image"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                id="imageInput"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={imageUploading}
                            />
                            <label
                                htmlFor="imageInput"
                                className={`cursor-pointer bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg border border-white/10 transition-colors flex items-center ${imageUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {imageUploading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                ) : (
                                    <Upload size={20} className="mr-2" />
                                )}
                                {imageUploading ? t('admin.product.form.uploading') : (imageUrl ? t('admin.product.form.replace_image') : t('admin.product.form.upload_image'))}
                            </label>
                        </div>
                    </div>

                    {/* Video URL */}
                    {/* Video URL */}
                    <div>
                        <label className="block text-white/80 text-sm font-bold mb-2">{t('admin.product.form.video_label')}</label>
                        <input
                            type="text"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-dancheong-red mb-3"
                        />

                        <div className="flex items-center space-x-4 mb-2">
                            <input
                                type="file"
                                id="videoInput"
                                className="hidden"
                                accept="video/*"
                                onChange={handleVideoUpload}
                                disabled={videoUploading}
                            />
                            <label
                                htmlFor="videoInput"
                                className={`cursor-pointer bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg border border-white/10 transition-colors flex items-center text-sm ${videoUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {videoUploading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                ) : (
                                    <Upload size={16} className="mr-2" />
                                )}
                                {videoUploading ? 'Uploading Video...' : (videoUrl ? 'Replace Video File' : 'Upload Video Content')}
                            </label>

                            {videoUrl && (
                                <button
                                    type="button"
                                    onClick={() => setVideoUrl('')}
                                    className="text-red-400 hover:text-red-300 text-xs flex items-center transition-colors"
                                    disabled={videoUploading}
                                >
                                    <Trash2 size={16} className="mr-1" />
                                    Remove Video
                                </button>
                            )}

                            {videoUploading && (
                                <span className="text-blue-400 text-xs animate-pulse">
                                    Uploading large files may take a minute...
                                </span>
                            )}

                            {videoUrl && !videoUrl.includes('youtube') && !videoUploading && (
                                <span className="text-green-400 text-xs flex items-center">
                                    Video uploaded successfully!
                                </span>
                            )}
                        </div>

                        <p className="text-white/40 text-xs mt-1">
                            Enter a YouTube URL OR upload a video file for the product detail page.
                        </p>
                    </div>

                    {/* Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-white/80 text-sm font-bold mb-2">{t('admin.product.form.main_category')}</label>
                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    setSubcategory(''); // Reset subcategory when main changes
                                }}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-dancheong-red"
                            >
                                <option value="Trend" className="bg-[#2a2a2a]">1F - 트렌드 / 팝업</option>
                                <option value="Performance" className="bg-[#2a2a2a]">2F - 공연</option>
                                <option value="Exhibition" className="bg-[#2a2a2a]">2F - 전시</option>
                                <option value="Art" className="bg-[#2a2a2a]">3F - 활동 / 스타일</option>
                                <option value="Style" className="bg-[#2a2a2a]">4F - 사진 / 영상</option>
                                <option value="Travel" className="bg-[#2a2a2a]">5F - 로컬 / 여행</option>
                                <option value="Community" className="bg-[#2a2a2a]">커뮤니티</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-white/80 text-sm font-bold mb-2">{t('admin.product.form.sub_category')}</label>
                            <select
                                value={subcategory}
                                onChange={(e) => setSubcategory(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-dancheong-red"
                            >
                                <option value="" className="bg-[#2a2a2a]">{t('common.select') || '선택하세요'}</option>
                                {category === 'Trend' && (
                                    <>
                                        <option value="popup" className="bg-[#2a2a2a]">팝업스토어</option>
                                        <option value="collab" className="bg-[#2a2a2a]">콜라보레이션</option>
                                        <option value="new" className="bg-[#2a2a2a]">신상품</option>
                                    </>
                                )}
                                {category === 'Performance' && (
                                    <>
                                        <option value="performance" className="bg-[#2a2a2a]">공연</option>
                                        <option value="booking" className="bg-[#2a2a2a]">예매하기</option>
                                    </>
                                )}
                                {category === 'Exhibition' && (
                                    <>
                                        <option value="exhibition" className="bg-[#2a2a2a]">전시</option>
                                    </>
                                )}
                                {category === 'Art' && (
                                    <>
                                        <option value="class" className="bg-[#2a2a2a]">클래스</option>
                                        <option value="fashion" className="bg-[#2a2a2a]">스타일</option>
                                    </>
                                )}
                                {category === 'Style' && (
                                    <>
                                        <option value="photo" className="bg-[#2a2a2a]">사진</option>
                                        <option value="video" className="bg-[#2a2a2a]">영상</option>
                                        <option value="media" className="bg-[#2a2a2a]">미디어</option>
                                    </>
                                )}
                                {category === 'Travel' && (
                                    <>
                                        <option value="local" className="bg-[#2a2a2a]">로컬 명소</option>
                                        <option value="course" className="bg-[#2a2a2a]">추천 코스</option>
                                        <option value="guide" className="bg-[#2a2a2a]">가이드</option>
                                    </>
                                )}
                                {category === 'Community' && (
                                    <>
                                        <option value="notice" className="bg-[#2a2a2a]">공지사항</option>
                                        <option value="qna" className="bg-[#2a2a2a]">문의하기</option>
                                        <option value="reviews" className="bg-[#2a2a2a]">리뷰</option>
                                    </>
                                )}
                            </select>
                        </div>
                    </div>

                    {/* Closed Days Management */}
                    <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                            <CalendarIcon size={20} className="mr-2 text-dancheong-red" />
                            {t('admin.product.form.manage_closed')}
                        </h3>
                        <p className="text-sm text-white/60 mb-6">
                            {t('admin.product.form.closed_description')}
                        </p>

                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Calendar UI */}
                            <div className="w-full max-w-sm">
                                <div className="flex justify-between items-center mb-4 bg-white/5 p-2 rounded-lg">
                                    <button type="button" onClick={prevMonth} className="p-1 hover:bg-white/10 rounded-full"><ChevronLeft size={20} /></button>
                                    <span className="font-bold flex-1 text-center">{currentCalDate.getFullYear()}. {String(currentCalDate.getMonth() + 1).padStart(2, '0')}</span>
                                    <button type="button" onClick={nextMonth} className="p-1 hover:bg-white/10 rounded-full"><ChevronRight size={20} /></button>
                                </div>

                                <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs text-white/40 font-bold uppercase">
                                    <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                                </div>
                                <div className="grid grid-cols-7 gap-2 place-items-center">
                                    {renderCalendar()}
                                </div>
                            </div>

                            {/* Selected Days List */}
                            <div className="flex-1">
                                <h4 className="font-bold text-sm mb-2 text-white/80">{t('admin.product.form.selected_closed')} ({closedDays.length})</h4>
                                <div className="bg-black/20 rounded-lg p-4 h-64 overflow-y-auto border border-white/5">
                                    {closedDays.length === 0 ? (
                                        <p className="text-white/40 text-sm">{t('admin.product.form.no_closed')}</p>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {closedDays.sort().map(day => (
                                                <span key={day} className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs flex items-center">
                                                    {day}
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleClosedDay(day)}
                                                        className="ml-2 hover:text-white"
                                                    >
                                                        &times;
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Localized Fields */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2">{t('admin.product.form.content_details')}</h3>

                        {['Title', 'Description', 'Date', 'Location', 'Price'].map((field) => {
                            const stateMap: Record<string, [LocalizedString, React.Dispatch<React.SetStateAction<LocalizedString>>]> = {
                                'Title': [title, setTitle],
                                'Description': [description, setDescription],
                                'Date': [date, setDate],
                                'Location': [locationState, setLocationState],
                                'Price': [price, setPrice]
                            };
                            const [state, setState] = stateMap[field];

                            return (
                                <div key={field} className="bg-white/5 p-4 rounded-lg">
                                    <label className="block text-white text-sm font-bold mb-3">{t(`common.${field.toLowerCase()}`) || field} (한국어)</label>
                                    <div>
                                        {field === 'Description' ? (
                                            <textarea
                                                value={state.ko}
                                                onChange={(e) => handleLocalizedChange(setState, 'ko', e.target.value)}
                                                placeholder={`Enter ${field} in Korean`}
                                                className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-sm focus:border-dancheong-red outline-none h-24"
                                            />
                                        ) : field === 'Price' ? (
                                            <input
                                                type="text"
                                                value={state.ko}
                                                onChange={(e) => {
                                                    const rawValue = e.target.value;
                                                    // Remove '원' and commas to get clean digits
                                                    const digits = rawValue.replace(/[^0-9]/g, '');

                                                    if (digits) {
                                                        // Format with commas and append '원'
                                                        const formatted = `${Number(digits).toLocaleString()}원`;
                                                        handleLocalizedChange(setState, 'ko', formatted);
                                                    } else {
                                                        // If empty, clear it
                                                        handleLocalizedChange(setState, 'ko', '');
                                                    }
                                                }}
                                                placeholder="예: 50,000 (숫자만 입력)"
                                                className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-sm focus:border-dancheong-red outline-none"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={state.ko}
                                                onChange={(e) => handleLocalizedChange(setState, 'ko', e.target.value)}
                                                placeholder={`Enter ${field} in Korean`}
                                                className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-sm focus:border-dancheong-red outline-none"
                                            />
                                        )}
                                        <p className="text-white/30 text-xs mt-1">
                                            * Other languages will be automatically translated.
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-end pt-6 border-t border-white/5">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-dancheong-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center shadow-lg"
                        >
                            <Save size={20} className="mr-2" />
                            {loading ? t('admin.product.form.saving') : t('admin.product.form.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormPage;
