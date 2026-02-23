import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Package, User as UserIcon, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AdminLayout: React.FC = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const { signOut } = useAuth();

    const handleLogout = async () => {
        await signOut();
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex h-screen bg-charcoal text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-[#2a2a2a] border-r border-white/5 flex flex-col">
                <div className="p-6 border-b border-white/5">
                    <h1 className="text-xl font-serif font-bold text-white">{t('admin.sidebar.title')}</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        to="/admin/products"
                        className={`flex items-center p-3 rounded-lg transition-colors ${isActive('/admin/products') ? 'bg-dancheong-red text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Package size={20} className="mr-3" />
                        {t('admin.sidebar.products')}
                    </Link>
                    <Link
                        to="/admin/users"
                        className={`flex items-center p-3 rounded-lg transition-colors ${isActive('/admin/users') ? 'bg-dancheong-red text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <UserIcon size={20} className="mr-3" />
                        {t('admin.sidebar.users')}
                    </Link>
                    <Link
                        to="/admin/bookings"
                        className={`flex items-center p-3 rounded-lg transition-colors ${isActive('/admin/bookings') ? 'bg-dancheong-red text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Wallet size={20} className="mr-3" />
                        {t('admin.sidebar.bookings')}
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full p-3 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <LogOut size={20} className="mr-3" />
                        {t('admin.sidebar.logout')}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-charcoal p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
