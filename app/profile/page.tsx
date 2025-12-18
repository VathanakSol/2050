'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { User, Mail, Calendar, Shield, Edit2, Save, X, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: unknown;
  };
}

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    avatar_url: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  const fetchUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data.user) {
        const userProfile: UserProfile = {
          id: data.user.id,
          email: data.user.email || '',
          created_at: data.user.created_at || new Date().toISOString(),
          updated_at: data.user.updated_at || new Date().toISOString(),
          email_confirmed_at: data.user.email_confirmed_at ?? null,
          last_sign_in_at: data.user.last_sign_in_at ?? null,
          user_metadata: data.user.user_metadata || {}
        };
        
        setProfile(userProfile);
        setEditForm({
          full_name: userProfile.user_metadata.full_name || '',
          avatar_url: userProfile.user_metadata.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase.auth]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
      return;
    }

    if (user) {
      fetchUserProfile();
    }
  }, [user, loading, router, fetchUserProfile]);

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: editForm.full_name,
          avatar_url: editForm.avatar_url
        }
      });

      if (error) {
        console.error('Error updating profile:', error);
        return;
      }

      // Refresh profile data
      await fetchUserProfile();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground/60">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-accent-yellow">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-3 border-white/30 flex items-center justify-center overflow-hidden">
                {profile.user_metadata.avatar_url ? (
                  <Image
                    src={profile.user_metadata.avatar_url}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={32} className="text-white" />
                )}
              </div>
              
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-lg md:text-xl font-bold text-white">
                {profile.user_metadata.full_name || 'Welcome Back!'}
              </h1>
              <p className="text-base text-white/80 mb-1">{profile.email}</p>
              <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white border border-white/30">
                  Member since {new Date(profile.created_at).getFullYear()}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
              >
                {isEditing ? <X size={16} /> : <Edit2 size={16} />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isEditing ? (
          <div className="max-w-xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Profile</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-0.5 text-sm">Update your personal information</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={editForm.avatar_url}
                    onChange={(e) => setEditForm({ ...editForm, avatar_url: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="Enter avatar image URL"
                  />
                </div>
                
                <div className="flex gap-3 pt-3">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none text-sm"
                  >
                    <Save size={16} />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 font-medium text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Profile Stats */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-base font-bold text-accent-yellow">Your Progress</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-0.5 text-xs">Keep your streak</p>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="relative">
                    <div className="flex items-center justify-between p-3 bg-white dark:from-gray-700 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 transition-all duration-200 group">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <Calendar className="text-blue-600 dark:text-blue-400" size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Days Active</p>
                          <p className="text-lg font-bold text-accent-yellow dark:text-white">
                            {Math.floor((new Date().getTime() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  
                  
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-base font-bold text-accent-yellow dark:text-white">Account Information</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-0.5 text-xs">Your personal details and account settings</p>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="group p-3 bg-white dark:from-gray-700 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 transition-all duration-200">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 dark:bg-blue-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <Mail className="text-accent-yellow dark:text-blue-400" size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email Address</p>
                          <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">{profile.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="group p-3 bg-white rounded-lg border border-gray-200 dark:border-gray-600 transition-all duration-200">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <User className="text-accent-yellow dark:text-purple-400" size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Full Name</p>
                          <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                            {profile.user_metadata.full_name || 'Not set'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                    <div className="flex items-center justify-between p-3 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 transition-all duration-200 group">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <Shield className="text-green-600 dark:text-green-400" size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Account Status</p>
                          <p className="text-sm font-bold text-green-600 dark:text-green-400">Active</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  </div>

                 
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}