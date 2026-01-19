import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FiCheck, FiCheckCircle, FiMoreVertical, FiEdit2, FiTrash2, FiSmile } from 'react-icons/fi';
import { format } from 'date-fns';
import EmojiPicker from '../common/EmojiPicker';

const Message = ({ message, isOwnMessage }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const { user } = useAuth();

  const handleEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      // API call to edit message
      setIsEditing(false);
      setShowMenu(false);
    }
  };

  const handleDelete = (forEveryone = false) => {
    if (window.confirm(forEveryone ? 'Delete for everyone?' : 'Delete for yourself?')) {
      // API call to delete message
      setShowMenu(false);
    }
  };

  const handleReaction = (emoji) => {
    // API call to add reaction
    setShowEmojiPicker(false);
  };

  const getMessageStatus = () => {
    if (message.status === 'sending') return 'Sending';
    if (message.read_at) return 'Read';
    if (message.delivered) return 'Delivered';
    return 'Sent';
  };

  const getStatusIcon = () => {
    if (message.status === 'sending') return <FiCheck className="w-4 h-4 text-gray-400" />;
    if (message.read_at) return <FiCheckCircle className="w-4 h-4 text-blue-500" />;
    return <FiCheck className="w-4 h-4 text-gray-500" />;
  };

  if (isEditing) {
    return (
      <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className="max-w-[70%]">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl rounded-tr-none p-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-transparent text-gray-900 dark:text-white resize-none outline-none"
              rows="2"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleEdit();
                }
                if (e.key === 'Escape') {
                  setIsEditing(false);
                  setEditContent(message.content);
                }
              }}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(message.content);
                }}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4 group`}
    >
      <div className="relative max-w-[70%]">
        {!isOwnMessage && (
          <div className="absolute -left-10 top-0">
            <img
              src={message.sender_profile_picture || `https://ui-avatars.com/api/?name=${message.sender_username}&background=random`}
              alt={message.sender_username}
              className="w-8 h-8 rounded-full"
            />
          </div>
        )}

        <div
          className={`relative rounded-2xl px-4 py-2 ${
            isOwnMessage
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none shadow-sm'
          }`}
        >
          {message.message_type === 'image' ? (
            <div className="space-y-2">
              <img
                src={message.content}
                alt="Shared image"
                className="rounded-lg max-w-full max-h-96 object-cover cursor-pointer"
                onClick={() => window.open(message.content, '_blank')}
              />
              {message.caption && (
                <p className="text-sm">{message.caption}</p>
              )}
            </div>
          ) : (
            <>
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
              
              {message.edited_at && (
                <span className="text-xs opacity-70 italic ml-2">(edited)</span>
              )}
            </>
          )}

          {/* Reactions */}
          {message.reactions && Object.keys(message.reactions).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.entries(message.reactions).map(([emoji, count]) => (
                <div
                  key={emoji}
                  className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-xs flex items-center space-x-1"
                >
                  <span>{emoji}</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          )}

          {/* Timestamp and status */}
          <div className={`flex items-center justify-end mt-1 space-x-2 text-xs ${
            isOwnMessage ? 'text-blue-200' : 'text-gray-500'
          }`}>
            <span>
              {format(new Date(message.created_at), 'HH:mm')}
            </span>
            {isOwnMessage && (
              <>
                {getStatusIcon()}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  {getMessageStatus()}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Message menu */}
        <div className="absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {isOwnMessage ? (
            <div className="-left-2">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 bg-gray-200 dark:bg-gray-700 rounded-full"
              >
                <FiMoreVertical className="w-4 h-4" />
              </button>
              
              {showMenu && (
                <div className="absolute left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(false)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <span>Delete for me</span>
                  </button>
                  <button
                    onClick={() => handleDelete(true)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-red-600"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <span>Delete for everyone</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="-right-2">
              <div className="flex space-x-1">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-1 bg-gray-200 dark:bg-gray-700 rounded-full"
                >
                  <FiSmile className="w-4 h-4" />
                </button>
              </div>
              
              {showEmojiPicker && (
                <div className="absolute right-0 mt-1 z-10">
                  <EmojiPicker
                    onEmojiSelect={handleReaction}
                    onClose={() => setShowEmojiPicker(false)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Message;
