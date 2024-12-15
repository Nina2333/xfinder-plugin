import React from 'react';
import { tagApi } from '../api';

interface Tag {
  id: number;
  text: string;
  color: string;
}

export const TagDisplay: React.FC<{username: string}> = ({username}) => {
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [loading, setLoading] = React.useState(true);

  // 加载标签
  const loadTags = async () => {
    setLoading(true);
    const userTags = await tagApi.getUserTags(username);
    setTags(userTags);
    setLoading(false);
  };

  // 删除标签
  const handleDeleteTag = async (tagId: number) => {
    if (await tagApi.deleteTag(tagId)) {
      setTags(tags.filter(tag => tag.id !== tagId));
    }
  };

  React.useEffect(() => {
    loadTags();
  }, [username]);

  if (loading) {
    return <div style={{ fontSize: '12px', color: '#536471' }}>加载标签中...</div>;
  }

  if (tags.length === 0) {
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4px',
      marginTop: '4px'
    }}>
      {tags.map(tag => (
        <span
          key={tag.id}
          style={{
            backgroundColor: tag.color,
            color: 'white',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'normal',
            display: 'flex',
            alignItems: 'center',
            cursor: 'default'
          }}
        >
          {tag.text}
          <button
            onClick={() => handleDeleteTag(tag.id)}
            style={{
              marginLeft: '4px',
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '0 4px',
              fontSize: '10px'
            }}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}; 