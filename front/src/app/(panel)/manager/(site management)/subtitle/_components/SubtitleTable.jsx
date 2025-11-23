"use client";
import React, { useState } from 'react';
import { FaTimes, FaCheck, FaTrash } from 'react-icons/fa';
import InputTypeOne from '@/components/InputTypeOne';
import TextAreaTypeOne from '@/components/TextAreaTypeOne';

const SubtitleTable = ({ title = "مدیریت زیرنویس‌ها" }) => {
    const [subtitleText, setSubtitleText] = useState('');
    const [subtitles, setSubtitles] = useState([
        { id: 1, text: 'زیرنویس نمونه اول', isActive: true },
        { id: 2, text: 'زیرنویس نمونه دوم', isActive: false },
        { id: 3, text: 'زیرنویس نمونه سوم', isActive: false },
    ]);

    const handleAddSubtitle = () => {
        if (subtitleText.trim() && subtitles.length < 10) {
            const newSubtitle = {
                id: subtitles.length + 1,
                text: subtitleText.trim(),
                isActive: false
            };
            setSubtitles([...subtitles, newSubtitle]);
            setSubtitleText('');
        }
    };

    const handleToggleActive = (id) => {
        setSubtitles(subtitles.map(subtitle => 
            subtitle.id === id 
                ? { ...subtitle, isActive: true }
                : { ...subtitle, isActive: false }
        ));
    };

    const handleDelete = (id) => {
        setSubtitles(subtitles.filter(subtitle => subtitle.id !== id));
    };

    return (
        <div className="p-2 md:p-6 md:pt-0">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            

            <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4  rounded-lg">
                <div className="flex-1">
                    <TextAreaTypeOne
                        title=""
                        name="subtitleText"
                        placeholder="متن زیرنویس را وارد کنید..."
                        value={subtitleText}
                        onChange={(e) => setSubtitleText(e.target.value)}
                        resize={true}
                        classNameTitle="mb-2 font-iranianSansDemiBold"
                    />
                </div>
                <div className="flex items-end">
                    <button
                        onClick={handleAddSubtitle}
                        disabled={subtitles.length >= 10}
                        className={`btn px-6 py-2 h-auto whitespace-nowrap ${
                            subtitles.length >= 10 
                                ? 'opacity-50 cursor-not-allowed' 
                                : ''
                        }`}
                    >
                        {subtitles.length >= 10 ? 'حداکثر 10 زیرنویس' : 'افزودن'}
                    </button>
                </div>
            </div>


            <div className="overflow-x-auto border border-gray-400/70 rounded-lg shadow">
                <table className="min-w-full rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-dMain/70 text-center text-black">
                            <th className="p-4 border border-l-2 border-gray-400 w-16">#</th>
                            <th className="p-4 border border-x-2 border-gray-400">زیرنویس</th>
                            <th className="p-4 border border-r-2 border-gray-400/70 w-24">اکشن</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subtitles.map((subtitle, index) => (
                            <tr key={subtitle.id} className="hover:bg-gray-50">
                                <td className="p-4 border border-l-2 border-gray-400 text-center w-16">
                                    {index + 1}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-right break-words max-w-xs">
                                    {subtitle.text}
                                </td>
                                <td className="p-4 border border-r-2 border-gray-400/70 text-center w-24">
                                    <div className="flex justify-center items-center gap-2">
                    
                                        {/* Toggle active/inactive button */}
                                        <button
                                            onClick={() => handleToggleActive(subtitle.id)}
                                            className={`p-2 rounded-full transition-colors ${
                                                subtitle.isActive 
                                                    ? 'bg-green-500 text-white hover:bg-green-600' 
                                                    : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                                            }`}
                                            title={subtitle.isActive ? 'Active (click to change)' : 'Inactive'}
                                        >
                                            {subtitle.isActive ? <FaCheck size={14} /> : <FaTimes size={14} />}
                                        </button>
                                        
                                        {/* Delete button */}
                                        <button
                                            onClick={() => handleDelete(subtitle.id)}
                                            className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                                            title="Delete"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubtitleTable;
