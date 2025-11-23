"use client";
import React, { useState, useMemo } from 'react';
import { FaSearch, FaUserPlus, FaEye, FaFilter, FaSlidersH, FaSortAmountDown, FaUserCheck, FaUserTimes, FaChild, FaArrowLeft, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Pagination from '@/components/Pagination';

const AddManager = ({ title = "افزودن مدیر جدید" }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        minShifts: '',
        maxShifts: '',
        minChildren: '',
        maxChildren: '',
        criminalRecord: 'all',
        sortBy: 'newest'
    });
    const router = useRouter();
    const itemsPerPage = 10;

    // Sample users data (potential managers)
    const users = [
        { id: 1, firstName: 'علی', lastName: 'احمدی', phone: '09123456789', shiftsCompleted: 25, hasCriminalRecord: false, joinDate: '1403/01/15', childrenCount: 2 },
        { id: 2, firstName: 'فاطمه', lastName: 'محمدی', phone: '09123456790', shiftsCompleted: 18, hasCriminalRecord: false, joinDate: '1403/02/20', childrenCount: 1 },
        { id: 3, firstName: 'حسن', lastName: 'رضایی', phone: '09123456791', shiftsCompleted: 32, hasCriminalRecord: true, joinDate: '1403/01/10', childrenCount: 3 },
        { id: 4, firstName: 'زهرا', lastName: 'کریمی', phone: '09123456792', shiftsCompleted: 15, hasCriminalRecord: false, joinDate: '1403/03/05', childrenCount: 0 },
        { id: 5, firstName: 'محمد', lastName: 'حسینی', phone: '09123456793', shiftsCompleted: 28, hasCriminalRecord: false, joinDate: '1403/01/25', childrenCount: 2 },
        { id: 6, firstName: 'مریم', lastName: 'نوری', phone: '09123456794', shiftsCompleted: 22, hasCriminalRecord: false, joinDate: '1403/02/15', childrenCount: 1 },
        { id: 7, firstName: 'رضا', lastName: 'موسوی', phone: '09123456795', shiftsCompleted: 35, hasCriminalRecord: true, joinDate: '1403/01/05', childrenCount: 4 },
        { id: 8, firstName: 'سارا', lastName: 'جعفری', phone: '09123456796', shiftsCompleted: 19, hasCriminalRecord: false, joinDate: '1403/03/10', childrenCount: 0 },
        { id: 9, firstName: 'امیر', lastName: 'کاظمی', phone: '09123456797', shiftsCompleted: 26, hasCriminalRecord: false, joinDate: '1403/02/01', childrenCount: 2 },
        { id: 10, firstName: 'نرگس', lastName: 'صادقی', phone: '09123456798', shiftsCompleted: 31, hasCriminalRecord: false, joinDate: '1403/01/20', childrenCount: 3 },
        { id: 11, firstName: 'حسین', lastName: 'طاهری', phone: '09123456799', shiftsCompleted: 17, hasCriminalRecord: true, joinDate: '1403/03/15', childrenCount: 1 },
        { id: 12, firstName: 'لیلا', lastName: 'مرادی', phone: '09123456800', shiftsCompleted: 24, hasCriminalRecord: false, joinDate: '1403/02/25', childrenCount: 2 },
        { id: 13, firstName: 'عبدالله', lastName: 'نوری', phone: '09123456801', shiftsCompleted: 29, hasCriminalRecord: false, joinDate: '1403/01/30', childrenCount: 0 },
        { id: 14, firstName: 'فریبا', lastName: 'احمدی', phone: '09123456802', shiftsCompleted: 21, hasCriminalRecord: false, joinDate: '1403/03/01', childrenCount: 3 },
        { id: 15, firstName: 'مهدی', lastName: 'کریمی', phone: '09123456803', shiftsCompleted: 33, hasCriminalRecord: true, joinDate: '1403/01/12', childrenCount: 2 },
        { id: 16, firstName: 'زینب', lastName: 'حسینی', phone: '09123456804', shiftsCompleted: 16, hasCriminalRecord: false, joinDate: '1403/03/20', childrenCount: 1 },
        { id: 17, firstName: 'محسن', lastName: 'موسوی', phone: '09123456805', shiftsCompleted: 27, hasCriminalRecord: false, joinDate: '1403/02/10', childrenCount: 0 },
        { id: 18, firstName: 'طاهره', lastName: 'جعفری', phone: '09123456806', shiftsCompleted: 30, hasCriminalRecord: false, joinDate: '1403/01/18', childrenCount: 4 },
        { id: 19, firstName: 'علی‌رضا', lastName: 'کاظمی', phone: '09123456807', shiftsCompleted: 20, hasCriminalRecord: true, joinDate: '1403/03/08', childrenCount: 2 },
        { id: 20, firstName: 'مرضیه', lastName: 'صادقی', phone: '09123456808', shiftsCompleted: 25, hasCriminalRecord: false, joinDate: '1403/02/28', childrenCount: 1 },
        { id: 21, firstName: 'حامد', lastName: 'طاهری', phone: '09123456809', shiftsCompleted: 34, hasCriminalRecord: false, joinDate: '1403/01/08', childrenCount: 3 },
        { id: 22, firstName: 'سودابه', lastName: 'مرادی', phone: '09123456810', shiftsCompleted: 18, hasCriminalRecord: false, joinDate: '1403/03/12', childrenCount: 0 },
        { id: 23, firstName: 'بهرام', lastName: 'نوری', phone: '09123456811', shiftsCompleted: 23, hasCriminalRecord: true, joinDate: '1403/02/18', childrenCount: 2 },
        { id: 24, firstName: 'گلناز', lastName: 'احمدی', phone: '09123456812', shiftsCompleted: 28, hasCriminalRecord: false, joinDate: '1403/01/22', childrenCount: 1 },
        { id: 25, firstName: 'فرهاد', lastName: 'کریمی', phone: '09123456813', shiftsCompleted: 32, hasCriminalRecord: false, joinDate: '1403/01/14', childrenCount: 3 }
    ];

    // Filter and sort users
    const filteredAndSortedUsers = useMemo(() => {
        let filtered = users.filter(user => {
            const matchesSearch = searchTerm === '' || 
                user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone.includes(searchTerm);

            const matchesShifts = (!filters.minShifts || user.shiftsCompleted >= parseInt(filters.minShifts)) &&
                                (!filters.maxShifts || user.shiftsCompleted <= parseInt(filters.maxShifts));

            const matchesChildren = (!filters.minChildren || user.childrenCount >= parseInt(filters.minChildren)) &&
                                  (!filters.maxChildren || user.childrenCount <= parseInt(filters.maxChildren));

            const matchesCriminalRecord = filters.criminalRecord === 'all' ||
                                        (filters.criminalRecord === 'has' && user.hasCriminalRecord) ||
                                        (filters.criminalRecord === 'none' && !user.hasCriminalRecord);

            return matchesSearch && matchesShifts && matchesChildren && matchesCriminalRecord;
        });

        // Sort users
        filtered.sort((a, b) => {
            if (filters.sortBy === 'newest') {
                return new Date(b.joinDate) - new Date(a.joinDate);
            } else if (filters.sortBy === 'oldest') {
                return new Date(a.joinDate) - new Date(b.joinDate);
            }
            return 0;
        });

        return filtered;
    }, [searchTerm, filters]);

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
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({
            minShifts: '',
            maxShifts: '',
            minChildren: '',
            maxChildren: '',
            criminalRecord: 'all',
            sortBy: 'newest'
        });
        setSearchTerm('');
        setCurrentPage(1);
    };

    const handleAddManager = async (user) => {
        const result = await Swal.fire({
            title: 'تأیید تبدیل به مدیر',
            html: `
                <div class="text-right">
                    <p class="mb-3">آیا مطمئن هستید که می‌خواهید این کاربر را به مدیر تبدیل کنید؟</p>
                    <div class="bg-gray-100 p-3 rounded-lg text-sm">
                        <p><strong>نام:</strong> ${user.firstName} ${user.lastName}</p>
                        <p><strong>شماره تماس:</strong> ${user.phone}</p>
                        <p><strong>تعداد شیفت:</strong> ${user.shiftsCompleted}</p>
                        <p><strong>سوء پیشینه:</strong> ${user.hasCriminalRecord ? 'دارد' : 'ندارد'}</p>
                    </div>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'بله، تبدیل کن',
            cancelButtonText: 'لغو',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            // In real app, this would make API call to promote user to manager
            console.log('Promoting user to manager:', user);
            
            Swal.fire({
                title: 'موفق!',
                text: `${user.firstName} ${user.lastName} با موفقیت به مدیر تبدیل شد`,
                icon: 'success',
                confirmButtonColor: '#10b981'
            });
        }
    };

    const handleViewUser = (userId) => {
        router.push(`/manager/users/${userId}`);
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                >
                    <FaArrowLeft size={16} />
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h1>
                    <p className="text-gray-600">انتخاب کاربر برای تبدیل به مدیر</p>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="جستجو بر اساس نام، نام خانوادگی یا شماره تماس..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Filter Button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                        <FaFilter size={16} />
                        فیلترها
                    </button>
                </div>

                {/* Filter Modal */}
                {showFilters && (
                    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className='absolute z-5 inset-0 bg-green-300/20 backdrop-blur-sm'>
                        </div>
                        <div className="bg-white z-10 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-lg flex justify-between items-center">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <FaSlidersH />
                                    فیلترهای پیشرفته
                                </h3>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                                    title="بستن"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                {/* Shifts Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        تعداد شیفت‌های انجام شده
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="number"
                                            placeholder="حداقل"
                                            value={filters.minShifts}
                                            onChange={(e) => handleFilterChange('minShifts', e.target.value)}
                                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <input
                                            type="number"
                                            placeholder="حداکثر"
                                            value={filters.maxShifts}
                                            onChange={(e) => handleFilterChange('maxShifts', e.target.value)}
                                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Children Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        تعداد فرزندان
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="number"
                                            placeholder="حداقل"
                                            value={filters.minChildren}
                                            onChange={(e) => handleFilterChange('minChildren', e.target.value)}
                                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <input
                                            type="number"
                                            placeholder="حداکثر"
                                            value={filters.maxChildren}
                                            onChange={(e) => handleFilterChange('maxChildren', e.target.value)}
                                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Criminal Record */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        وضعیت سوء پیشینه
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="criminalRecord"
                                                value="all"
                                                checked={filters.criminalRecord === 'all'}
                                                onChange={(e) => handleFilterChange('criminalRecord', e.target.value)}
                                                className="ml-2"
                                            />
                                            همه
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="criminalRecord"
                                                value="has"
                                                checked={filters.criminalRecord === 'has'}
                                                onChange={(e) => handleFilterChange('criminalRecord', e.target.value)}
                                                className="ml-2"
                                            />
                                            دارای سوء پیشینه
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="criminalRecord"
                                                value="none"
                                                checked={filters.criminalRecord === 'none'}
                                                onChange={(e) => handleFilterChange('criminalRecord', e.target.value)}
                                                className="ml-2"
                                            />
                                            بدون سوء پیشینه
                                        </label>
                                    </div>
                                </div>

                                {/* Sort By */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        مرتب‌سازی بر اساس
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="sortBy"
                                                value="newest"
                                                checked={filters.sortBy === 'newest'}
                                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                                className="ml-2"
                                            />
                                            جدیدترین ثبت‌نام
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="sortBy"
                                                value="oldest"
                                                checked={filters.sortBy === 'oldest'}
                                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                                className="ml-2"
                                            />
                                            قدیمی‌ترین ثبت‌نام
                                        </label>
                                    </div>
                                </div>

                                {/* Quick Filter Buttons */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        فیلترهای سریع
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => {
                                                handleFilterChange('minShifts', '20');
                                                handleFilterChange('criminalRecord', 'none');
                                            }}
                                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors"
                                        >
                                            <FaUserCheck className="inline ml-1" />
                                            کاربران برتر
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleFilterChange('criminalRecord', 'has');
                                            }}
                                            className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200 transition-colors"
                                        >
                                            <FaUserTimes className="inline ml-1" />
                                            دارای سوء پیشینه
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleFilterChange('minChildren', '1');
                                            }}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                                        >
                                            <FaChild className="inline ml-1" />
                                            دارای فرزند
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between p-6 border-t">
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    پاک کردن فیلترها
                                </button>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    اعمال فیلترها
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Results Count */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                    <FaSortAmountDown className="inline ml-2" />
                    {filteredAndSortedUsers.length} کاربر یافت شد
                </p>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="min-w-full">
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
                                <td className="p-4 border border-l-2 border-gray-400/70 text-center w-16">
                                    {startIndex + index + 1}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400/70 text-right">
                                    {user.firstName}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400/70 text-right">
                                    {user.lastName}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400/70 text-center">
                                    {user.phone}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400/70 text-center">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                        {user.shiftsCompleted}
                                    </span>
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400/70 text-center">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        user.hasCriminalRecord 
                                            ? 'bg-red-100 text-red-800' 
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {user.hasCriminalRecord ? 'دارد' : 'ندارد'}
                                    </span>
                                </td>
                                <td className="p-4 border border-r-2 border-gray-400/70 text-center w-32">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => handleViewUser(user.id)}
                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                            title="مشاهده جزئیات"
                                        >
                                            <FaEye size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleAddManager(user)}
                                            className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                                            title="تبدیل به مدیر"
                                        >
                                            <FaUserPlus size={16} />
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
                    <div key={user.id} className="bg-white rounded-xl shadow-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">
                                    {user.firstName} {user.lastName}
                                </h3>
                                <p className="text-sm text-gray-500">#{startIndex + index + 1}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleViewUser(user.id)}
                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                    title="مشاهده جزئیات"
                                >
                                    <FaEye size={16} />
                                </button>
                                <button
                                    onClick={() => handleAddManager(user)}
                                    className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                                    title="تبدیل به مدیر"
                                >
                                    <FaUserPlus size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div dir='ltr' className="flex justify-center">
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

export default AddManager;
