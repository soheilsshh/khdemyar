"use client"
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Filter({ activeFilters, setActiveFilters, activeApprovalFilters, setActiveApprovalFilters }) {
    
    const [statusItems] = useState([
        { title: "وضعیت اول", id: 0, color: "bg-red-500" },
        { title: "وضعیت دوم", id: 1, color: "bg-green-500" },
        { title: "وضعیت سوم", id: 2, color: "bg-yellow-500" },
        { title: "وضعیت چهارم", id: 3, color: "bg-blue-500" },
    ]);

    const [approvalItems] = useState([
        { title: "تایید شده", id: true, color: "bg-green-500" },
        { title: "رد شده", id: false, color: "bg-red-500" },
        { title: "در انتظار", id: null, color: "bg-yellow-500" },
    ]);

    const [isSmall, setIsSmall] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Status filter functions
    const removeStatusFilter = (id) => {
        setActiveFilters((prev) => prev.filter((item) => item !== id));
    };

    const addStatusFilter = (id) => {
        setActiveFilters((prev) => [...prev, id]);
    };

    const isStatusExist = (id) => activeFilters.includes(id);

    const handleStatusClick = (id) => {
        if (isStatusExist(id)) {
            removeStatusFilter(id);
        } else {
            addStatusFilter(id);
        }
    };

    // Approval filter functions
    const removeApprovalFilter = (id) => {
        setActiveApprovalFilters((prev) => prev.filter((item) => item !== id));
    };

    const addApprovalFilter = (id) => {
        setActiveApprovalFilters((prev) => [...prev, id]);
    };

    const isApprovalExist = (id) => activeApprovalFilters.includes(id);

    const handleApprovalClick = (id) => {
        if (isApprovalExist(id)) {
            removeApprovalFilter(id);
        } else {
            addApprovalFilter(id);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsSmall(window.innerWidth < 640);
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex justify-center items-center gap-2">
            {isSmall ? (
                <>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        فیلتر
                    </button>

                    {/* Modal */}
                    <AnimatePresence>
                        {showModal && (
                            <motion.div
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowModal(false)}
                            >
                                <motion.div
                                    className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Status Filter */}
                                    <h2 className="text-lg font-bold mb-4 text-gray-800">فیلتر بر اساس وضعیت</h2>
                                    <div className="space-y-3 mb-6">
                                        {statusItems.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => handleStatusClick(item.id)}
                                                className={`w-full p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                                                    isStatusExist(item.id)
                                                        ? `${item.color} text-white border-transparent shadow-lg`
                                                        : `bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300`
                                                }`}
                                            >
                                                <div className={`w-3 h-3 rounded-full ${
                                                    isStatusExist(item.id) ? 'bg-white/30' : item.color
                                                }`} />
                                                {item.title}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Approval Filter */}
                                    <h2 className="text-lg font-bold mb-4 text-gray-800">فیلتر بر اساس تایید/رد</h2>
                                    <div className="space-y-3">
                                        {approvalItems.map((item) => (
                                            <button
                                                key={item.id === null ? 'null' : item.id.toString()}
                                                onClick={() => handleApprovalClick(item.id)}
                                                className={`w-full p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                                                    isApprovalExist(item.id)
                                                        ? `${item.color} text-white border-transparent shadow-lg`
                                                        : `bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300`
                                                }`}
                                            >
                                                <div className={`w-3 h-3 rounded-full ${
                                                    isApprovalExist(item.id) ? 'bg-white/30' : item.color
                                                }`} />
                                                {item.title}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="mt-6 w-full bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-xl transition-colors"
                                    >
                                        بستن
                                    </button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            ) : (
                <div className="flex gap-2 flex-wrap">
                    {/* Status Filters */}
                    <div className="flex gap-2">
                        {statusItems.map((item) => (
                            <button
                                onClick={() => handleStatusClick(item.id)}
                                className={`px-3 py-2 rounded-xl border-2 transition-all duration-200 flex items-center gap-2 text-sm ${
                                    isStatusExist(item.id)
                                        ? `${item.color} text-white border-transparent shadow-lg hover:shadow-xl`
                                        : `bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md`
                                }`}
                                key={item.id}
                            >
                                <div className={`w-2 h-2 rounded-full ${
                                    isStatusExist(item.id) ? 'bg-white/30' : item.color
                                }`} />
                                {item.title}
                            </button>
                        ))}
                    </div>
                    
                    {/* Separator */}
                    <div className="w-px bg-gray-300 mx-2"></div>
                    
                    {/* Approval Filters */}
                    <div className="flex gap-2">
                        {approvalItems.map((item) => (
                            <button
                                onClick={() => handleApprovalClick(item.id)}
                                className={`px-3 py-2 rounded-xl border-2 transition-all duration-200 flex items-center gap-2 text-sm ${
                                    isApprovalExist(item.id)
                                        ? `${item.color} text-white border-transparent shadow-lg hover:shadow-xl`
                                        : `bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md`
                                }`}
                                key={item.id === null ? 'null' : item.id.toString()}
                            >
                                <div className={`w-2 h-2 rounded-full ${
                                    isApprovalExist(item.id) ? 'bg-white/30' : item.color
                                }`} />
                                {item.title}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Filter;
