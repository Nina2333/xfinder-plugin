interface Tag {
    id: string;
    name: string;
    color: string;
  }
  
  export const getTags = async (username: string): Promise<Tag[]> => {
    const result = await chrome.storage.sync.get(username);
    return result[username] || [];
  };
  
  export const saveTags = async (username: string, tags: Tag[]): Promise<void> => {
    await chrome.storage.sync.set({ [username]: tags });
  };