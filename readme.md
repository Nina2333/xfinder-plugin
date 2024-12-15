1. manifest.json - Chrome 插件的配置文件
2. src/content.tsx - 注入到 Twitter 页面的主要代码
3. src/components/TaggerPanel.tsx - 标签管理面板组件
4. src/storage.ts - 处理标签数据的存储

主要功能建议包含：
1. 在 Twitter 用户主页显示标签管理按钮
2. 点击按钮弹出标签管理面板
3. 可以添加、编辑、删除标签
4. 使用 Chrome Storage API 保存标签数据
5. 在 Twitter 时间线中显示已添加的标签