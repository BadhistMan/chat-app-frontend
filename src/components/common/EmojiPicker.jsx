import React, { useState } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { FiX } from 'react-icons/fi';

const EmojiPicker = ({ onEmojiSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleEmojiSelect = (emoji) => {
    onEmojiSelect(emoji);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search emojis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent text-gray-900 dark:text-white outline-none"
        />
        <button
          onClick={onClose}
          className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
      
      <div className="w-[352px] h-[435px]">
        <Picker
          data={data}
          onEmojiSelect={handleEmojiSelect}
          theme="auto"
          previewPosition="none"
          searchPosition="none"
          skinTonePosition="none"
          perLine={8}
          emojiSize={24}
          emojiButtonSize={32}
          maxFrequentRows={1}
        />
      </div>
      
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        Click an emoji to add reaction
      </div>
    </div>
  );
};

export default EmojiPicker;
