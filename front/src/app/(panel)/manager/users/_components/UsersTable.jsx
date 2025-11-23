"use client";
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaInfo, FaSearch, FaFilter, FaTimes, FaSlidersH, FaSortAmountDown, FaUserCheck, FaUserTimes, FaChild } from 'react-icons/fa';
import Pagination from '@/components/Pagination';

const UsersTable = ({ title = "مدیریت کاربران" }) => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    // Filter states
    const [filters, setFilters] = useState({
        search: '',
        minShifts: '',
        maxShifts: '',
        minChildren: '',
        maxChildren: '',
        criminalRecord: 'all', // 'all', 'yes', 'no'
        sortBy: 'newest' // 'newest', 'oldest'
    });
    const [showFilters, setShowFilters] = useState(false);

    // Sample users data
    const [users] = useState([
        {
            id: 1,
            firstName: 'علی',
            lastName: 'احمدی',
            phone: '09123456789',
            shiftsCount: 45,
            hasCriminalRecord: false,
            joinDate: '1403/01/15',
            childrenCount: 2
        },
        {
            id: 2,
            firstName: 'فاطمه',
            lastName: 'محمدی',
            phone: '09187654321',
            shiftsCount: 38,
            hasCriminalRecord: false,
            joinDate: '1403/02/20',
            childrenCount: 1
        },
        {
            id: 3,
            firstName: 'حسن',
            lastName: 'رضایی',
            phone: '09111111111',
            shiftsCount: 32,
            hasCriminalRecord: true,
            joinDate: '1403/03/10',
            childrenCount: 3
        },
        {
            id: 4,
            firstName: 'زهرا',
            lastName: 'کریمی',
            phone: '09222222222',
            shiftsCount: 28,
            hasCriminalRecord: false,
            joinDate: '1403/04/05',
            childrenCount: 0
        },
        {
            id: 5,
            firstName: 'محمد',
            lastName: 'نوری',
            phone: '09333333333',
            shiftsCount: 41,
            hasCriminalRecord: false,
            joinDate: '1403/05/12',
            childrenCount: 2
        },
        {
            id: 6,
            firstName: 'مریم',
            lastName: 'حسینی',
            phone: '09444444444',
            shiftsCount: 35,
            hasCriminalRecord: false,
            joinDate: '1403/06/18',
            childrenCount: 1
        },
        {
            id: 7,
            firstName: 'رضا',
            lastName: 'کاظمی',
            phone: '09555555555',
            shiftsCount: 29,
            hasCriminalRecord: true,
            joinDate: '1403/07/25',
            childrenCount: 4
        },
        {
            id: 8,
            firstName: 'نرگس',
            lastName: 'فرهادی',
            phone: '09666666666',
            shiftsCount: 33,
            hasCriminalRecord: false,
            joinDate: '1403/08/30',
            childrenCount: 2
        },
        {
            id: 9,
            firstName: 'امیر',
            lastName: 'صادقی',
            phone: '09777777777',
            shiftsCount: 26,
            hasCriminalRecord: false,
            joinDate: '1403/09/08',
            childrenCount: 0
        },
        {
            id: 10,
            firstName: 'سارا',
            lastName: 'موسوی',
            phone: '09888888888',
            shiftsCount: 37,
            hasCriminalRecord: false,
            joinDate: '1403/10/15',
            childrenCount: 1
        },
        {
            id: 11,
            firstName: 'حامد',
            lastName: 'نوری',
            phone: '09999999999',
            shiftsCount: 31,
            hasCriminalRecord: false,
            joinDate: '1403/11/22',
            childrenCount: 3
        },
        {
            id: 12,
            firstName: 'لیلا',
            lastName: 'احمدی',
            phone: '09000000000',
            shiftsCount: 24,
            hasCriminalRecord: false,
            joinDate: '1403/12/03',
            childrenCount: 2
        },
        {
            id: 13,
            firstName: 'عرفان',
            lastName: 'محمدی',
            phone: '09111111112',
            shiftsCount: 42,
            hasCriminalRecord: false,
            joinDate: '1404/01/10',
            childrenCount: 1
        },
        {
            id: 14,
            firstName: 'نازنین',
            lastName: 'کریمی',
            phone: '09222222223',
            shiftsCount: 36,
            hasCriminalRecord: false,
            joinDate: '1404/02/18',
            childrenCount: 0
        },
        {
            id: 15,
            firstName: 'مهدی',
            lastName: 'رضایی',
            phone: '09333333334',
            shiftsCount: 30,
            hasCriminalRecord: true,
            joinDate: '1404/03/25',
            childrenCount: 2
        },
        {
            id: 16,
            firstName: 'آرزو',
            lastName: 'حسینی',
            phone: '09444444445',
            shiftsCount: 27,
            hasCriminalRecord: false,
            joinDate: '1404/04/12',
            childrenCount: 1
        },
        {
            id: 17,
            firstName: 'پویا',
            lastName: 'کاظمی',
            phone: '09555555556',
            shiftsCount: 39,
            hasCriminalRecord: false,
            joinDate: '1404/05/20',
            childrenCount: 3
        },
        {
            id: 18,
            firstName: 'شیدا',
            lastName: 'فرهادی',
            phone: '09666666667',
            shiftsCount: 34,
            hasCriminalRecord: false,
            joinDate: '1404/06/28',
            childrenCount: 2
        },
        {
            id: 19,
            firstName: 'کامران',
            lastName: 'صادقی',
            phone: '09777777778',
            shiftsCount: 25,
            hasCriminalRecord: false,
            joinDate: '1404/07/05',
            childrenCount: 0
        },
        {
            id: 20,
            firstName: 'گلناز',
            lastName: 'موسوی',
            phone: '09888888889',
            shiftsCount: 40,
            hasCriminalRecord: false,
            joinDate: '1404/08/15',
            childrenCount: 1
        }
    ]);

    // Filter and sort logic
    const filteredAndSortedUsers = useMemo(() => {
        let filtered = users.filter(user => {
            // Search filter
            const searchTerm = filters.search.toLowerCase();
            const matchesSearch = !filters.search || 
                user.firstName.toLowerCase().includes(searchTerm) ||
                user.lastName.toLowerCase().includes(searchTerm) ||
                user.phone.includes(searchTerm);

            // Shifts count filter
            const minShifts = filters.minShifts ? parseInt(filters.minShifts) : 0;
            const maxShifts = filters.maxShifts ? parseInt(filters.maxShifts) : Infinity;
            const matchesShifts = user.shiftsCount >= minShifts && user.shiftsCount <= maxShifts;

            // Children count filter
            const minChildren = filters.minChildren ? parseInt(filters.minChildren) : 0;
            const maxChildren = filters.maxChildren ? parseInt(filters.maxChildren) : Infinity;
            const matchesChildren = user.childrenCount >= minChildren && user.childrenCount <= maxChildren;

            // Criminal record filter
            const matchesCriminalRecord = filters.criminalRecord === 'all' ||
                (filters.criminalRecord === 'yes' && user.hasCriminalRecord) ||
                (filters.criminalRecord === 'no' && !user.hasCriminalRecord);

            return matchesSearch && matchesShifts && matchesChildren && matchesCriminalRecord;
        });

        // Sort by join date
        filtered.sort((a, b) => {
            if (filters.sortBy === 'newest') {
                return new Date(b.joinDate) - new Date(a.joinDate);
            } else {
                return new Date(a.joinDate) - new Date(b.joinDate);
            }
        });

        return filtered;
    }, [users, filters]);

    // Pagination logic
    const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = filteredAndSortedUsers.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1); // Reset to first page when filtering
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            minShifts: '',
            maxShifts: '',
            minChildren: '',
            maxChildren: '',
            criminalRecord: 'all',
            sortBy: 'newest'
        });
        setCurrentPage(1);
    };

    const handleViewDetails = (user) => {
        router.push(`/manager/users/${user.id}`);
    };

    const handleViewRegistration = (user) => {
        router.push(`/manager/registration-requests/${user.id}`);
    };

    return (
        <div className="p-2 md:p-6 md:pt-0">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            
            {/* Search and Filter Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
                {/* Search Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
                        <input
                            type="text"
                            placeholder="جستجو بر اساس نام، نام خانوادگی یا شماره تماس..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full pr-12 pl-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(true)}
                        className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <FaSlidersH />
                        فیلترهای پیشرفته
                    </button>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">
                            {filteredAndSortedUsers.length} کاربر از {users.length} کاربر یافت شد
                        </span>
                    </div>
                    {(filters.search || filters.minShifts || filters.maxShifts || filters.minChildren || filters.maxChildren || filters.criminalRecord !== 'all') && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm"
                        >
                            <FaTimes />
                            پاک کردن فیلترها
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Modal */}
            {showFilters && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowFilters(false)}
                    ></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky z-50 top-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <FaSlidersH size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">فیلترهای پیشرفته</h2>
                                        <p className="text-blue-100 text-sm">جستجو و فیلتر دقیق کاربران</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <FaTimes size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Shifts Range */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-gray-700 mb-3">
                                        <FaSortAmountDown className="text-blue-500" />
                                        <h3 className="font-semibold">محدوده تعداد شیفت</h3>
                                    </div>
                                    
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                                    حداقل تعداد شیفت
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        min="0"
                                                        max="50"
                                                        value={filters.minShifts}
                                                        onChange={(e) => handleFilterChange('minShifts', e.target.value)}
                                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                                                    />
                                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                                                        ≥
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                                    حداکثر تعداد شیفت
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        placeholder="50"
                                                        min="0"
                                                        max="50"
                                                        value={filters.maxShifts}
                                                        onChange={(e) => handleFilterChange('maxShifts', e.target.value)}
                                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                                                    />
                                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                                                        ≤
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Children Range */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-gray-700 mb-3">
                                        <FaChild className="text-green-500" />
                                        <h3 className="font-semibold">محدوده تعداد فرزندان</h3>
                                    </div>
                                    
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                                    حداقل تعداد فرزندان
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        min="0"
                                                        max="5"
                                                        value={filters.minChildren}
                                                        onChange={(e) => handleFilterChange('minChildren', e.target.value)}
                                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-400 transition-all duration-200"
                                                    />
                                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                                                        ≥
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                                    حداکثر تعداد فرزندان
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        placeholder="5"
                                                        min="0"
                                                        max="5"
                                                        value={filters.maxChildren}
                                                        onChange={(e) => handleFilterChange('maxChildren', e.target.value)}
                                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-400 transition-all duration-200"
                                                    />
                                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                                                        ≤
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Criminal Record */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-gray-700 mb-3">
                                        <FaUserCheck className="text-green-500" />
                                        <h3 className="font-semibold">وضعیت سوء پیشینه</h3>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {[
                                            { value: 'all', label: 'همه کاربران', icon: FaUserCheck, color: 'gray' },
                                            { value: 'no', label: 'بدون سوء پیشینه', icon: FaUserCheck, color: 'green' },
                                            { value: 'yes', label: 'دارای سوء پیشینه', icon: FaUserTimes, color: 'red' }
                                        ].map((option) => (
                                            <label key={option.value} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:border-blue-300 cursor-pointer transition-all duration-200">
                                                <input
                                                    type="radio"
                                                    name="criminalRecord"
                                                    value={option.value}
                                                    checked={filters.criminalRecord === option.value}
                                                    onChange={(e) => handleFilterChange('criminalRecord', e.target.value)}
                                                    className="sr-only"
                                                />
                                                <div className={`p-2 rounded-lg ${
                                                    filters.criminalRecord === option.value 
                                                        ? `bg-${option.color}-100 text-${option.color}-600` 
                                                        : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                    <option.icon size={16} />
                                                </div>
                                                <span className={`font-medium ${
                                                    filters.criminalRecord === option.value ? 'text-gray-800' : 'text-gray-600'
                                                }`}>
                                                    {option.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Sort Options */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-gray-700 mb-3">
                                        <FaSortAmountDown className="text-purple-500" />
                                        <h3 className="font-semibold">مرتب‌سازی</h3>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {[
                                            { value: 'newest', label: 'جدیدترین ثبت‌نام', desc: 'کاربران جدیدتر ابتدا' },
                                            { value: 'oldest', label: 'قدیمی‌ترین ثبت‌نام', desc: 'کاربران قدیمی‌تر ابتدا' }
                                        ].map((option) => (
                                            <label key={option.value} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:border-purple-300 cursor-pointer transition-all duration-200">
                                                <input
                                                    type="radio"
                                                    name="sortBy"
                                                    value={option.value}
                                                    checked={filters.sortBy === option.value}
                                                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                                    className="sr-only"
                                                />
                                                <div className={`p-2 rounded-lg ${
                                                    filters.sortBy === option.value 
                                                        ? 'bg-purple-100 text-purple-600' 
                                                        : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                    <FaSortAmountDown size={16} />
                                                </div>
                                                <div>
                                                    <div className={`font-medium ${
                                                        filters.sortBy === option.value ? 'text-gray-800' : 'text-gray-600'
                                                    }`}>
                                                        {option.label}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {option.desc}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Filters */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-gray-700 mb-3">
                                        <FaFilter className="text-orange-500" />
                                        <h3 className="font-semibold">فیلترهای سریع</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => {
                                                handleFilterChange('minShifts', '30');
                                                handleFilterChange('criminalRecord', 'no');
                                            }}
                                            className="p-3 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-colors text-center"
                                        >
                                            <div className="text-green-600 font-medium">کاربران فعال</div>
                                            <div className="text-xs text-green-500">30+ شیفت، بدون سوء پیشینه</div>
                                        </button>
                                        
                                        <button
                                            onClick={() => {
                                                handleFilterChange('minShifts', '40');
                                                handleFilterChange('criminalRecord', 'no');
                                            }}
                                            className="p-3 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition-colors text-center"
                                        >
                                            <div className="text-blue-600 font-medium">کاربران برتر</div>
                                            <div className="text-xs text-blue-500">40+ شیفت، بدون سوء پیشینه</div>
                                        </button>
                                        
                                        <button
                                            onClick={() => {
                                                handleFilterChange('criminalRecord', 'yes');
                                            }}
                                            className="p-3 bg-red-50 border-2 border-red-200 rounded-xl hover:bg-red-100 transition-colors text-center"
                                        >
                                            <div className="text-red-600 font-medium">دارای سوء پیشینه</div>
                                            <div className="text-xs text-red-500">تمام کاربران با سوء پیشینه</div>
                                        </button>
                                        
                                        <button
                                            onClick={() => {
                                                handleFilterChange('maxShifts', '20');
                                                handleFilterChange('maxChildren', '2');
                                            }}
                                            className="p-3 bg-yellow-50 border-2 border-yellow-200 rounded-xl hover:bg-yellow-100 transition-colors text-center"
                                        >
                                            <div className="text-yellow-600 font-medium">کاربران جدید</div>
                                            <div className="text-xs text-yellow-500">کمتر از 20 شیفت، 0-2 فرزند</div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl border-t">
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                                >
                                    <FaTimes />
                                    پاک کردن همه فیلترها
                                </button>
                                
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        انصراف
                                    </button>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                                    >
                                        اعمال فیلترها
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto border border-gray-400/70 rounded-lg shadow">
                <table className="min-w-full rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-dMain/70 text-center text-black">
                            <th className="p-4 border border-l-2 border-gray-400 w-16">#</th>
                            <th className="p-4 border border-x-2 border-gray-400">نام</th>
                            <th className="p-4 border border-x-2 border-gray-400">نام خانوادگی</th>
                            <th className="p-4 border border-x-2 border-gray-400">شماره تماس</th>
                            <th className="p-4 border border-x-2 border-gray-400">تعداد شیفت</th>
                            <th className="p-4 border border-x-2 border-gray-400">سوء پیشینه</th>
                            <th className="p-4 border border-r-2 border-gray-400/70 w-32">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user, index) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="p-4 border border-l-2 border-gray-400 text-center w-16">
                                    {startIndex + index + 1}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-right">
                                    {user.firstName}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-right">
                                    {user.lastName}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-right">
                                    {user.phone}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-center">
                                    {user.shiftsCount}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-center">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        user.hasCriminalRecord 
                                            ? 'bg-red-100 text-red-800' 
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {user.hasCriminalRecord ? 'دارد' : 'ندارد'}
                                    </span>
                                </td>
                                <td className="p-4 border border-r-2 border-gray-400/70 text-center w-32">
                                    <div className="flex justify-center items-center gap-2">
                                        {/* View user details button */}
                                        <button
                                            onClick={() => handleViewDetails(user)}
                                            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                            title="مشاهده جزئیات کاربر"
                                        >
                                            <FaEye size={14} />
                                        </button>
                                        
                                        {/* View registration details button */}
                                        <button
                                            onClick={() => handleViewRegistration(user)}
                                            className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                                            title="مشاهده اطلاعات ثبت‌نام"
                                        >
                                            <FaInfo size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Table */}
            <div className="md:hidden space-y-4">
                {currentUsers.map((user, index) => (
                    <div key={user.id} className="border border-gray-400/70 rounded-lg p-4 bg-white shadow">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-lg">{user.firstName} {user.lastName}</h3>
                                <p className="text-sm text-gray-600">#{startIndex + index + 1}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleViewDetails(user)}
                                    className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                    title="مشاهده جزئیات"
                                >
                                    <FaEye size={16} />
                                </button>
                                <button
                                    onClick={() => handleViewRegistration(user)}
                                    className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                                    title="اطلاعات ثبت‌نام"
                                >
                                    <FaInfo size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-gray-600">شماره تماس:</span>
                                <span className="mr-2">{user.phone}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">تعداد شیفت:</span>
                                <span className="mr-2">{user.shiftsCount}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-gray-600">سوء پیشینه:</span>
                                <span className={`mr-2 px-2 py-1 rounded-full text-xs ${
                                    user.hasCriminalRecord 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-green-100 text-green-800'
                                }`}>
                                    {user.hasCriminalRecord ? 'دارد' : 'ندارد'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div dir='ltr' className="mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default UsersTable;
