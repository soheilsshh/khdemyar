"use client";
import React, { useState } from 'react';
import { FaUser, FaCalendarAlt, FaHistory, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Profile from './_components/Profile';
import Shifts from './_components/Shifts';
import MyShifts from './_components/MyShifts';

export default function UserPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'profile', label: 'پروفایل', icon: FaUser },
    { id: 'shifts', label: 'شیفت‌ها', icon: FaCalendarAlt },
    { id: 'my-shifts', label: 'شیفت‌های من', icon: FaHistory }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile />;
      case 'shifts':
        return <Shifts />;
      case 'my-shifts':
        return <MyShifts />;
      default:
        return <Profile />;
    }
  };

  const handleTabSelect = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const getCurrentTab = () => {
    return tabs.find(tab => tab.id === activeTab);
  };

  return (
    <div dir='rtl' className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Desktop Tab Navigation */}
        <div className="hidden md:block bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
          <div className="flex gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="md:hidden bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full flex items-center justify-between p-4 text-right"
          >
            <div className="flex items-center gap-3">
              {(() => {
                const currentTab = getCurrentTab();
                const Icon = currentTab.icon;
                return (
                  <>
                    <Icon className="text-blue-500" />
                    <span className="font-medium text-gray-800">{currentTab.label}</span>
                  </>
                );
              })()}
            </div>
            {isMobileMenuOpen ? (
              <FaChevronUp className="text-gray-500" />
            ) : (
              <FaChevronDown className="text-gray-500" />
            )}
          </button>
          
          {isMobileMenuOpen && (
            <div className="border-t border-gray-100">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabSelect(tab.id)}
                    className={`w-full flex items-center gap-3 p-4 text-right transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-500'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={activeTab === tab.id ? 'text-blue-500' : 'text-gray-500'} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-h-[600px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}