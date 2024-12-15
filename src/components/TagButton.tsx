import React from 'react';
import { tagApi } from '../api';

export const TagButton: React.FC<{
    username: string;
    onTagAdded?: () => void;
}> = ({ username, onTagAdded }) => {
    const [isAdding, setIsAdding] = React.useState(false);
    const handleClick = async () => {
        const tagText = prompt('请输入标签：');
        if (!tagText) return;
        setIsAdding(true);
        const newTag = await tagApi.addTag(username, tagText);
        setIsAdding(false);
        if (newTag && onTagAdded) {
            onTagAdded();
        }
    };
    return (
        <button
            onClick={handleClick}
            disabled={isAdding}
            style={{
                padding: '4px 8px',
                borderRadius: '16px',
                border: '1px solid #1DA1F2',
                backgroundColor: 'transparent',
                cursor: isAdding ? 'wait' : 'pointer',
                fontSize: '12px',
                marginTop: '4px',
                opacity: isAdding ? 0.7 : 1
            }}
        >
            {isAdding ? '添加中...' : '添加标签'}
        </button>
    );
};