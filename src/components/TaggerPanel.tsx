import React, { useState, useEffect } from 'react';
import { getTags, saveTags } from '../storage';

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Props {
  username: string;
  onClose: () => void;
}

export const TaggerPanel: React.FC<Props> = ({ username, onClose }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedColor, setSelectedColor] = useState('#1da1f2');

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    const userTags = await getTags(username);
    setTags(userTags || []);
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    
    const newTagObj: Tag = {
      id: Date.now().toString(),
      name: newTag.trim(),
      color: selectedColor
    };

    const updatedTags = [...tags, newTagObj];
    await saveTags(username, updatedTags);
    setTags(updatedTags);
    setNewTag('');
  };

  const handleDeleteTag = async (tagId: string) => {
    const updatedTags = tags.filter(tag => tag.id !== tagId);
    await saveTags(username, updatedTags);
    setTags(updatedTags);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 9999
    }}>
      <h3>管理标签 - @{username}</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="输入新标签"
          style={{ marginRight: '10px' }}
        />
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        />
        <button onClick={handleAddTag}>添加</button>
      </div>

      <div>
        {tags.map(tag => (
          <div key={tag.id} style={{ marginBottom: '8px' }}>
            <span style={{
              backgroundColor: tag.color,
              padding: '2px 8px',
              borderRadius: '4px',
              color: 'white',
              marginRight: '8px'
            }}>
              {tag.name}
            </span>
            <button onClick={() => handleDeleteTag(tag.id)}>删除</button>
          </div>
        ))}
      </div>

      <button onClick={onClose} style={{ marginTop: '20px' }}>关闭</button>
    </div>
  );
};