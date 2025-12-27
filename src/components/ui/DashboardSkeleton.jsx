import React from 'react';

const DashboardSkeleton = () => (
  <div className="animate-pulse space-y-6">
    {/* Header Skeleton */}
    <div className="rounded-lg shadow-sm p-6 mb-6" style={{backgroundColor: 'var(--tertiary-color)'}}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          <div className="h-8 bg-gray-300 rounded w-48"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-20 h-8 bg-gray-300 rounded"></div>
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>

    {/* Navigation Tabs Skeleton */}
    <div className="rounded-lg shadow-sm p-2 flex flex-wrap gap-2" style={{backgroundColor: 'var(--light-text)'}}>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-300 rounded-lg w-32"></div>
      ))}
    </div>

    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-lg p-6 shadow-sm" style={{backgroundColor: 'var(--light-text)'}}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="w-16 h-6 bg-gray-300 rounded"></div>
          </div>
          <div className="h-8 bg-gray-300 rounded w-24 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
      ))}
    </div>

    {/* Secondary Stats Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-lg p-6 shadow-sm" style={{backgroundColor: 'var(--light-text)'}}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="w-12 h-6 bg-gray-300 rounded"></div>
          </div>
          <div className="h-6 bg-gray-300 rounded w-20 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-28"></div>
        </div>
      ))}
    </div>
    
    {/* Content Cards Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-lg p-6 shadow-sm" style={{backgroundColor: 'var(--light-text)'}}>
          {/* Card Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-300 rounded w-40"></div>
            <div className="h-8 bg-gray-300 rounded w-24"></div>
          </div>
          
          {/* Card Content */}
          <div className="space-y-4">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                    <div className="h-3 bg-gray-300 rounded w-24"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-12"></div>
                </div>
                <div className="h-2 bg-gray-300 rounded w-full mb-2"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-300 rounded w-20"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Bottom Row Content Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="rounded-lg p-6 shadow-sm" style={{backgroundColor: 'var(--light-text)'}}>
          {/* Card Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-300 rounded w-36"></div>
            <div className="h-8 bg-gray-300 rounded w-28"></div>
          </div>
          
          {/* Card Content */}
          <div className="space-y-3">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-5 h-5 bg-gray-300 rounded mr-3"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-40"></div>
                  <div className="h-3 bg-gray-300 rounded w-32"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Assignment-specific Skeleton */}
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-300 rounded w-64"></div>
        <div className="h-10 bg-gray-300 rounded w-40"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-lg p-6 shadow-sm border" style={{borderColor: 'var(--primary-color)'}}>
            <div className="space-y-4">
              {[...Array(2)].map((_, j) => (
                <div key={j} className="border border-orange-200 bg-orange-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="h-5 bg-gray-300 rounded w-48"></div>
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-32 mb-3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                    <div className="h-8 bg-gray-300 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Attendance-specific Skeleton */}
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-300 rounded w-48"></div>
        <div className="text-right space-y-2">
          <div className="h-4 bg-gray-300 rounded w-32"></div>
          <div className="h-10 bg-gray-300 rounded w-16"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-lg p-6 shadow-sm" style={{backgroundColor: 'var(--light-text)'}}>
            <div className="space-y-4">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex justify-between items-center">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Tutor-specific Skeleton */}
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-lg shadow-md p-6" style={{backgroundColor: 'var(--tertiary-color)'}}>
        <div className="h-8 bg-gray-300 rounded w-64 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-full max-w-md"></div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg shadow-md p-6" style={{backgroundColor: 'var(--tertiary-color)'}}>
        <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border-2 rounded-lg" style={{borderColor: 'var(--primary-color)'}}>
              <div className="w-6 h-6 bg-gray-300 rounded mx-auto mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
