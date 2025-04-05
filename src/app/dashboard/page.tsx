'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    } else if (!loading && user) {
      setIsLoading(false);
    }
  }, [user, loading, router]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome, {user.firstName}!</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-indigo-900 mb-2">Your Profile</h2>
              <p className="text-indigo-700 mb-4">Complete your profile to increase your visibility</p>
              <button
                onClick={() => router.push('/dashboard/profile')}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Edit Profile →
              </button>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-green-900 mb-2">Job Applications</h2>
              <p className="text-green-700 mb-4">Track your job applications and their status</p>
              <button
                onClick={() => router.push('/dashboard/applications')}
                className="text-green-600 hover:text-green-800 font-medium"
              >
                View Applications →
              </button>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-purple-900 mb-2">Skills Assessment</h2>
              <p className="text-purple-700 mb-4">Take assessments to showcase your skills</p>
              <button
                onClick={() => router.push('/dashboard/skills')}
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Take Assessment →
              </button>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600">No recent activity to display.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 