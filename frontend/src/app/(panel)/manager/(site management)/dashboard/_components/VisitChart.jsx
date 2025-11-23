"use client";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const VisitChart = () => {
    // Sample data for monthly visits
    const data = [
        { month: 'فروردین', visits: 1200 },
        { month: 'اردیبهشت', visits: 1900 },
        { month: 'خرداد', visits: 3000 },
        { month: 'تیر', visits: 2800 },
        { month: 'مرداد', visits: 1890 },
        { month: 'شهریور', visits: 2390 },
        { month: 'مهر', visits: 3490 },
        { month: 'آبان', visits: 3200 },
        { month: 'آذر', visits: 2800 },
        { month: 'دی', visits: 2100 },
        { month: 'بهمن', visits: 1800 },
        { month: 'اسفند', visits: 1500 }
    ];

    return (
        <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6">بازدیدهای ماهانه سایت</h3>
            <div className="h-80 overflow-x-auto md:overflow-x-visible">
                <div className="min-w-[600px] md:min-w-0 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="month" 
                                stroke="#666"
                                fontSize={12}
                            />
                            <YAxis 
                                stroke="#666"
                                fontSize={12}
                                domain={[0, 4000]}
                                tickCount={9}
                                tickFormatter={(value) => value}
                                tick={{ dx: -30 }}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="visits" 
                                stroke="#10b981" 
                                strokeWidth={3}
                                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                                
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default VisitChart;
