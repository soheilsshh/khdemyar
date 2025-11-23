"use client";
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaUser, FaCalendarAlt, FaHistory, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function UserLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = useMemo(() => ([
    { id: 'profile', label: 'پروفایل', icon: FaUser, href: '/user/profile' },
    { id: 'shifts', label: 'شیفت‌ها', icon: FaCalendarAlt, href: '/user/shifts' },
    { id: 'my-shifts', label: 'شیفت‌های من', icon: FaHistory, href: '/user/my-shifts' }
  ]), []);

  const activeId = useMemo(() => {
    if (!pathname) return 'profile';
    if (pathname.startsWith('/user/profile')) return 'profile';
    if (pathname.startsWith('/user/shifts')) return 'shifts';
    if (pathname.startsWith('/user/my-shifts')) return 'my-shifts';
    return 'profile';
  }, [pathname]);

  const getCurrentTab = () => tabs.find(t => t.id === activeId) || tabs[0];

  const handleTabSelect = (href) => {
    setIsMobileMenuOpen(false);
    router.push(href);
  };

  return (
    <div dir='rtl' className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Desktop Tab Navigation */}
        <div className="hidden md:block bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
          <div className="flex gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeId === tab.id;
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-200 ${
                    isActive ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon />
                  {tab.label}
                </Link>
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
                const isActive = activeId === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabSelect(tab.href)}
                    className={`w-full flex items-center gap-3 p-4 text-right transition-all duration-200 ${
                      isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-500' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={isActive ? 'text-blue-500' : 'text-gray-500'} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-h-[600px]">
          {children}
        </div>
      </div>
    </div>
  );
}


