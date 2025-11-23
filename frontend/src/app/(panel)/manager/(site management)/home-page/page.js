"use client";
import React from 'react';
import HomePageManager from './_components/HomePageManager';

function HomePageManagementPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <HomePageManager />
      </div>
    </div>
  );
}

export default HomePageManagementPage;