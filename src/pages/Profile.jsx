import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiEdit2,
  FiSave,
  FiCamera,
  FiGlobe,
  FiClock,
  FiCheckCircle,
  FiX,
  FiLock,
  FiShield
} from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState('basic'); // 'basic', 'privacy', 'security'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    profile_picture: '',
    privacy_settings: {
      hide_last_seen: false,
      hide_online_status: false,
      who_can_message: 'everyone',
      hide_profile_info: false
    }
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [stats, setStats] = useState({
    totalChats: 0,
    totalMessages: 0,
    joinedDate: new Date(),
    lastActive: new Date()
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        profile_picture: user.profile_picture || '',
        privacy_settings: user.privacy_settings || {
          hide_last_seen: false,
          hide_online_status: false,
          who_can_message: 'everyone',
          hide_profile_info: false
        }
      });
      
      // In a real app, fetch user stats from API
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalChats: 24,
        totalMessages: 1560,
        joinedDate: user?.created_at ? new Date(user.created_at) : new Date(),
        lastActive: user?.last_seen ? new Date(user.last_seen) : new Date()
      });
    }, 500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      privacy_settings: {
        ...prev.privacy_settings,
        [key]: value
      }
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProfileImage(file);
        setFormData(prev => ({
          ...prev,
          profile_picture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const updateData = {
        username: formData.username,
        bio: formData.bio,
        profile_picture: formData.profile_picture,
        privacy_settings: formData.privacy_settings
      };

      await updateProfile(updateData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        profile_picture: user.profile_picture || '',
        privacy_settings: user.privacy_settings || {
          hide_last_seen: false,
          hide_online_status: false,
          who_can_message: 'everyone',
          hide_profile_info: false
        }
      });
      setImagePreview(null);
      setProfileImage(null);
    }
    setIsEditing(false);
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden">
            <img
              src={imagePreview || formData.profile_picture || `https://ui-avatars.com/api/?name=${formData.username}&size=128&background=random`}
              alt={formData.username}
              className="w-full h-full object-cover"
            />
          </div>
          
          {isEditing && (
            <label
              htmlFor="profile-image-upload"
              className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-lg"
            >
              <FiCamera className="w-5 h-5" />
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="text-center">
          {isEditing ? (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="text-2xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-600 text-center focus:outline-none focus:border-blue-500 py-1"
            />
          ) : (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {formData.username}
            </h2>
          )}
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {user?.is_online ? '🟢 Online' : '⚫ Offline'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <FiMail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <div className="flex-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p className="font-medium text-gray-900 dark:text-white">{formData.email}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <FiUser className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1" />
          <div className="flex-1">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Bio</p>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="font-medium text-gray-900 dark:text-white">
                {formData.bio || 'No bio yet'}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <FiCalendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <div className="flex-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {format(stats.joinedDate, 'MMMM dd, yyyy')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <FiClock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <div className="flex-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">Last Active</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {format(stats.lastActive, 'MMM dd, yyyy HH:mm')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Profile Visibility
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Hide Last Seen</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Others won't see when you were last online
              </p>
            </div>
            <button
              onClick={() => handlePrivacyChange('hide_last_seen', !formData.privacy_settings.hide_last_seen)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                formData.privacy_settings.hide_last_seen ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  formData.privacy_settings.hide_last_seen ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Hide Online Status</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Others won't see when you're online
              </p>
            </div>
            <button
              onClick={() => handlePrivacyChange('hide_online_status', !formData.privacy_settings.hide_online_status)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                formData.privacy_settings.hide_online_status ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  formData.privacy_settings.hide_online_status ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Hide Profile Info</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Non-friends won't see your profile details
              </p>
            </div>
            <button
              onClick={() => handlePrivacyChange('hide_profile_info', !formData.privacy_settings.hide_profile_info)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                formData.privacy_settings.hide_profile_info ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  formData.privacy_settings.hide_profile_info ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Who Can Message Me
        </h3>
        <div className="space-y-2">
          {['everyone', 'friends', 'nobody'].map((option) => (
            <div key={option} className="flex items-center">
              <input
                type="radio"
                id={`message-${option}`}
                name="who_can_message"
                checked={formData.privacy_settings.who_can_message === option}
                onChange={() => handlePrivacyChange('who_can_message', option)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={`message-${option}`}
                className="ml-3 block text-sm font-medium text-gray-900 dark:text-gray-300 capitalize cursor-pointer"
              >
                {option.replace('_', ' ')}
                <span className="text-gray-500 dark:text-gray-400 text-xs block">
                  {option === 'everyone' && 'Anyone can send you messages'}
                  {option === 'friends' && 'Only accepted contacts can message you'}
                  {option === 'nobody' && 'No one can message you'}
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Account Security
        </h3>
        <div className="space-y-3">
          <button className="w-full text-left p-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FiShield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Add extra security to your account
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                Not set up
              </span>
            </div>
          </button>

          <button className="w-full text-left p-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FiLock className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Change Password</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Update your password regularly
                  </p>
                </div>
              </div>
              <FiChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Active Sessions
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                <FiGlobe className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Chrome on Windows</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Current session • Active now
                </p>
              </div>
            </div>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your profile and account settings
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <FiX className="w-4 h-4 inline mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                <FiSave className="w-4 h-4 inline mr-2" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
            >
              <FiEdit2 className="w-4 h-4 inline mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex">
                <button
                  onClick={() => setEditMode('basic')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 ${
                    editMode === 'basic'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Basic Info
                </button>
                <button
                  onClick={() => setEditMode('privacy')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 ${
                    editMode === 'privacy'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Privacy
                </button>
                <button
                  onClick={() => setEditMode('security')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 ${
                    editMode === 'security'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Security
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <motion.div
                key={editMode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {editMode === 'basic' && renderBasicInfo()}
                {editMode === 'privacy' && renderPrivacySettings()}
                {editMode === 'security' && renderSecuritySettings()}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* User Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Chats</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalChats}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FiUser className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Messages Sent</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalMessages.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Account Age</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {Math.floor((new Date() - stats.joinedDate) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <FiCalendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition">
                  Download My Data
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 transition">
                  Change Theme
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 transition">
                  Delete Account
                </button>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Profile Completion
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Profile Strength</span>
                    <span className="font-medium text-gray-900 dark:text-white">80%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-4/5"></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {[
                    { label: 'Profile Picture', completed: !!formData.profile_picture },
                    { label: 'Bio', completed: !!formData.bio && formData.bio.length > 10 },
                    { label: 'Email Verified', completed: true },
                    { label: 'Privacy Settings', completed: true }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${item.completed ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className={`text-sm ${item.completed ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
