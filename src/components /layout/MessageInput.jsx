import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FiSmile,
  FiPaperclip,
  FiImage,
  FiSend,
  FiMic,
  FiX
} from 'react-icons/fi';
import EmojiPicker from '../common/EmojiPicker';

const MessageInput = ({ onSendMessage, onTyping }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      setShowEmojiPicker(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else {
      onTyping();
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      // Convert images to base64 and add to attachments
      imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachments(prev => [...prev, {
            type: 'image',
            data: reader.result,
            name: file.name
          }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSendWithAttachments = () => {
    if (attachments.length > 0) {
      attachments.forEach(attachment => {
        onSendMessage(attachment.data, 'image');
      });
      setAttachments([]);
    }
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {attachments.map((attachment, index) => (
              <div key={index} className="relative">
                {attachment.type === 'image' && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                    <img
                      src={attachment.data}
                      alt={attachment.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <button
                  onClick={() => removeAttachment(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        {/* Emoji Picker Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiSmile className="w-5 h-5" />
          </button>
          
          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-2">
              <EmojiPicker
                onEmojiSelect={handleEmojiSelect}
                onClose={() => setShowEmojiPicker(false)}
              />
            </div>
          )}
        </div>

        {/* Attachment Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiPaperclip className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-2xl border-none resize-none text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 outline-none transition"
            rows="1"
            style={{ minHeight: '44px', maxHeight: '120px' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />
          
          {/* Quick Actions */}
          <div className="absolute right-3 bottom-3 flex items-center space-x-2">
            {message.length > 0 && (
              <button
                type="submit"
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
              >
                <FiSend className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={attachments.length > 0 ? handleSendWithAttachments : handleSubmit}
          disabled={!message.trim() && attachments.length === 0}
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {attachments.length > 0 ? (
            <FiSend className="w-5 h-5" />
          ) : message.trim() ? (
            <FiSend className="w-5 h-5" />
          ) : (
            <FiMic className="w-5 h-5" />
          )}
        </button>
      </form>

      {/* Quick Actions Bar */}
      <div className="flex items-center justify-center space-x-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <FiImage className="w-4 h-4" />
          <span>Photo</span>
        </button>
        <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <FiPaperclip className="w-4 h-4" />
          <span>Document</span>
        </button>
        <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <FiMic className="w-4 h-4" />
          <span>Audio</span>
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
