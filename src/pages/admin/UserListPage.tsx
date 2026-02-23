import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { User as UserIcon, Shield, Search, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface UserProfile {
    id: string;
    full_name: string | null;
    email: string | null;
    role: 'USER' | 'ADMIN';
    created_at?: string;
    avatar_url?: string | null;
}

const UserListPage: React.FC = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/users');
            setUsers(response.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('회원 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleRole = async (targetUser: UserProfile) => {
        if (targetUser.id === (currentUser?.id as any)) {
            alert('자기 자신의 권한은 변경할 수 없습니다.');
            return;
        }

        const newRole = targetUser.role === 'ADMIN' ? 'USER' : 'ADMIN';
        const actionName = newRole === 'ADMIN' ? '관리자로 승격' : '일반 회원으로 강등';

        if (!window.confirm(`"${targetUser.full_name || '사용자'}" 님을 ${actionName}하시겠습니까?`)) {
            return;
        }

        try {
            setProcessingId(targetUser.id);
            await api.put(`/api/users/${targetUser.id}/role`, { role: newRole });

            // Optimistic update
            setUsers(users.map(u =>
                u.id === targetUser.id ? { ...u, role: newRole } : u
            ));

            alert('권한이 성공적으로 변경되었습니다.');
        } catch (error: any) {
            console.error('Error updating role:', error);
            alert(`권한 변경 중 오류가 발생했습니다: ${error.response?.data?.message || error.message}`);
        } finally {
            setProcessingId(null);
        }
    };

    const handleDeleteUser = async (targetUser: UserProfile) => {
        if (!window.confirm(`정말로 "${targetUser.full_name || '사용자'}" 님을 삭제하시겠습니까?\n삭제된 계정은 복구할 수 없습니다.`)) {
            return;
        }

        try {
            setProcessingId(targetUser.id);
            await api.delete(`/api/users/${targetUser.id}`);

            setUsers(users.filter(u => u.id !== targetUser.id));
            alert('회원이 성공적으로 삭제되었습니다.');
        } catch (error: any) {
            console.error('Error deleting user:', error);
            alert(`회원 삭제 실패: ${error.response?.data?.message || error.message}`);
        } finally {
            setProcessingId(null);
        }
    };

    const filteredUsers = users.filter(user =>
        (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-white mb-2">{t('admin.user.title')}</h1>
                    <p className="text-white/60">{t('admin.user.subtitle')}</p>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
                    <input
                        type="text"
                        placeholder={t('admin.user.search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-dancheong-red transition-colors"
                    />
                </div>
            </div>

            <div className="bg-[#2a2a2a] rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-white/60 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">{t('admin.user.table.user')}</th>
                                <th className="p-4 font-medium">{t('admin.user.table.email')}</th>
                                <th className="p-4 font-medium">{t('admin.user.table.role')}</th>
                                <th className="p-4 font-medium text-right">{t('admin.user.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-white/40">
                                        {t('common.loading')}
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-white/40">
                                        {t('admin.user.no_users')}
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} alt={user.full_name || 'User'} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <UserIcon size={20} className="text-white/60" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{user.full_name || 'Unknown'}</div>
                                                    <div className="text-xs text-white/40 md:hidden">{user.email || '-'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-white/80 hidden md:table-cell">
                                            {user.email || <span className="text-white/20 italic">{t('auth.no_email') || '이메일 없음'}</span>}
                                        </td>
                                        <td className="p-4">
                                            {user.role === 'ADMIN' ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dancheong-red/20 text-dancheong-red text-xs font-medium border border-dancheong-red/20">
                                                    <Shield size={12} />
                                                    ADMIN
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs font-medium border border-white/5">
                                                    USER
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            {currentUser?.id !== user.id && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleToggleRole(user)}
                                                        disabled={processingId === user.id}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${user.role === 'ADMIN'
                                                            ? 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                                                            : 'bg-dancheong-red text-white hover:bg-red-700 shadow-lg shadow-red-900/20'
                                                            } ${processingId === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        {user.role === 'ADMIN' ? t('admin.user.demote') : t('admin.user.promote')}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user)}
                                                        disabled={processingId === user.id}
                                                        className="p-1.5 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                            {currentUser?.id === user.id && (
                                                <span className="text-xs text-white/20 italic p-2">It's You</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserListPage;
