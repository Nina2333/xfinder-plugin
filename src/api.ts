interface Tag {
  id: number;
  text: string;
  color: string;
  username: string;
}

export const tagApi = {
  // 获取用户标签
  async getUserTags(username: string): Promise<Tag[]> {
    try {
      const response = await fetch(`YOUR_API_URL/tags/${username}`);
      if (!response.ok) throw new Error('Failed to fetch tags');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  },

  // 添加标签
  async addTag(username: string, tagText: string): Promise<Tag | null> {
    try {
      const response = await fetch(`YOUR_API_URL/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          text: tagText,
          color: '#1DA1F2' // 默认颜色
        })
      });
      if (!response.ok) throw new Error('Failed to add tag');
      return await response.json();
    } catch (error) {
      console.error('Error adding tag:', error);
      return null;
    }
  },

  // 删除标签
  async deleteTag(tagId: number): Promise<boolean> {
    try {
      const response = await fetch(`YOUR_API_URL/tags/${tagId}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting tag:', error);
      return false;
    }
  }
}; 