import React from 'react';
import ReactDOM from 'react-dom';

// 定义选择器
const SELECTORS = {
    userProfile: {
        nameContainer: '[data-testid="UserName"]',
        username: '[data-testid="UserName"] div[dir] > span',
        actionButtons: '[data-testid="UserActions"]'
    },
    tweet: {
        article: 'article',
        username: 'div[data-testid="User-Name"] div[dir] > span',
        toolBar: '[role="group"]'
    }
};

// 创建标签按钮组件
const TagButton: React.FC<{ username: string }> = ({ username }) => {
    const handleClick = () => {
        // 获取当前用户的标签
        chrome.storage.sync.get(username, (result) => {
            const currentTags = result[username] || [];
            // 弹出输入框
            const newTag = prompt('请输入标签：');
            if (newTag) {
                // 保存新标签
                chrome.storage.sync.set({
                    [username]: [...currentTags, {
                        id: Date.now(),
                        text: newTag,
                        color: '#1DA1F2'
                    }]
                });
            }
        });
    };

    return (
        <button
            onClick={handleClick}
            style={{
                padding: '4px 8px',
                borderRadius: '16px',
                border: '1px solid #1DA1F2',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                marginLeft: '8px'
            }}
        >
            添加标签
        </button>
    );
};

// 创建标签显示组件
const TagDisplay: React.FC<{ username: string }> = ({ username }) => {
    // 标签状态
    const [tags, setTags] = React.useState<Array<{ id: number, text: string, color: string }>>([]);

    React.useEffect(() => {
        chrome.storage.sync.get(username, (result) => {
            setTags(result[username] || []);
        });

        // 监听存储变化
        chrome.storage.onChanged.addListener((changes) => {
            if (changes[username]) {
                setTags(changes[username].newValue || []);
            }
        });
    }, [username]);

    return (
        <span style={{ marginLeft: '8px' }}>
            {tags.map(tag => (
                <span
                    key={tag.id}
                    style={{
                        backgroundColor: tag.color,
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        marginRight: '4px'
                    }}
                >
                    {tag.text}
                </span>
            ))}
        </span>
    );
};

class TwitterTagger {
    private observer: MutationObserver;

    constructor() {
        this.observer = new MutationObserver(this.handleMutation.bind(this));
        this.init();
    }

    private init() {
        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    private handleMutation() {
        // 处理用户主页
        const nameContainer = document.querySelector(SELECTORS.userProfile.nameContainer);
        if (nameContainer) {
            this.injectToUserProfile(nameContainer);
        }

        // 处理推文
        document.querySelectorAll(SELECTORS.tweet.article).forEach(article => {
            this.injectToTweet(article);
        });
    }

    private injectToUserProfile(container: Element) {
        if (container.querySelector('.twitter-tagger-injected')) return;
        const username = this.getUsername(container);
        if (!username) return;
        const userBio = container.querySelector(SELECTORS.userProfile.userBio);
        if (userBio) {
            const tagContainer = document.createElement('div');
            tagContainer.className = 'twitter-tagger-injected';
            userBio.parentElement?.insertBefore(tagContainer, userBio);
            const TagManager: React.FC = () => {
                const [key, setKey] = React.useState(0);
                return (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <TagDisplay key={key} username={username} />
                        <TagButton
                            username={username}
                            onTagAdded={() => setKey(k => k + 1)}
                        />
                    </div>
                );
            };
            ReactDOM.render(<TagManager />, tagContainer);
        }
    }
    
    private injectToTweet(article: Element) {
        if (article.querySelector('.twitter-tagger-injected')) return;

        const username = this.getUsername(article);
        if (!username) return;

        const nameContainer = article.querySelector(SELECTORS.tweet.username)?.parentElement;
        if (nameContainer) {
            const tagContainer = document.createElement('span');
            tagContainer.className = 'twitter-tagger-injected';
            nameContainer.appendChild(tagContainer);

            ReactDOM.render(
                <TagDisplay username={username} />,
                tagContainer
            );
        }
    }

    private getUsername(element: Element): string | null {
        const usernameElement = element.querySelector(SELECTORS.userProfile.username) ||
            element.querySelector(SELECTORS.tweet.username);
        return usernameElement?.textContent?.replace('@', '') || null;
    }
}

// 初始化
new TwitterTagger();