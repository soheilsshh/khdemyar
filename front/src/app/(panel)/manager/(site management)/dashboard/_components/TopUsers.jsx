"use client";
import React from 'react';
import { FaTrophy, FaMedal, FaAward } from 'react-icons/fa';

const TopUsers = () => {
    const topUsers = [
        {
            id: 1,
            name: 'علی احمدی',
            shifts: 45,
            rank: 1,
            icon: FaTrophy,
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-100'
        },
        {
            id: 2,
            name: 'فاطمه محمدی',
            shifts: 38,
            rank: 2,
            icon: FaMedal,
            color: 'text-gray-400',
            bgColor: 'bg-gray-100'
        },
        {
            id: 3,
            name: 'حسن رضایی',
            shifts: 32,
            rank: 3,
            icon: FaAward,
            color: 'text-orange-500',
            bgColor: 'bg-orange-100'
        }
    ];

    return (
        <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6">برترین کاربران</h3>
            <div className="space-y-4">
                {topUsers.map((user) => {
                    const IconComponent = user.icon;
                    return (
                        <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-4 space-x-reverse">
                                <div className={`${user.bgColor} p-3 rounded-full`}>
                                    <IconComponent size={20} className={user.color} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">{user.name}</h4>
                                    <p className="text-sm text-gray-600">{user.shifts} شیفت</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-gray-400">#{user.rank}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TopUsers;
