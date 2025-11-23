"use client";
import React from 'react';

const StatCard = ({ title, value, icon: Icon, color, bgColor }) => {
    return (
        <div className={`${bgColor} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
                    <p className="text-3xl font-bold text-gray-800">{value}</p>
                </div>
                <div className={`${color} p-3 rounded-full`}>
                    <Icon size={24} className="text-white" />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
