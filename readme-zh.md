# DeepSeek网页总结 Chrome插件

[English Version](README.md)

## 功能介绍

该Chrome浏览器插件可以自动识别当前网页的内容，并通过DeepSeek API进行中文总结，帮助用户快速了解网页的核心内容。

## 安装方法

1. 下载或克隆本项目到本地
2. 打开Chrome浏览器，进入扩展程序管理页面（chrome://extensions/）
3. 开启"开发者模式"（通常在页面右上角）
4. 点击"加载已解压的扩展程序"，选择本项目所在的文件夹
5. 插件安装成功后，会在Chrome浏览器右上角出现插件图标

## 使用说明

1. 首次使用时，点击插件图标，在弹出的界面中输入DeepSeek API Key
2. 导航到需要总结的网页
3. 点击插件图标，然后点击"总结当前页面"按钮
4. 等待几秒钟，插件会显示网页的中文总结结果

## API Key管理

- 首次使用时必须输入API Key
- 可以通过插件选项页面修改API Key
- 请访问DeepSeek官网获取您自己的API Key

## 技术原理

1. **内容提取**：插件使用`content.js`脚本提取网页的主要文本内容，过滤掉脚本、样式、广告等无关元素
2. **API调用**：通过`background.js`脚本调用DeepSeek API，将提取的内容发送到API服务器
3. **结果显示**：API返回总结结果后，在`popup.html`中显示给用户

## 注意事项

- 插件需要访问互联网才能调用DeepSeek API
- 为了保护您的API Key安全，插件使用Chrome的安全存储机制保存API Key
- 插件仅在当前激活的标签页上工作
- 对于非常长的网页，插件会自动截断内容，只发送前5000个字符到API

## 文件结构

```
├── manifest.json      # 插件配置文件
├── background.js      # 后台脚本，处理API请求
├── content.js         # 网页内容提取脚本
├── popup.html         # 插件弹出界面
├── popup.js           # 弹出界面逻辑
├── options.html       # 选项页面，用于API Key管理
├── options.js         # 选项页面逻辑
├── README.md          # 英文说明文档
└── readme-zh.md       # 中文说明文档
```

## 浏览器兼容性

- Chrome浏览器 88.0+（支持Manifest V3）

## 更新日志

### v1.0.0 (2025-12-19)
- 初始版本发布
- 实现网页内容自动提取
- 集成DeepSeek API进行中文总结
- 支持API Key管理

## 联系方式

如有问题或建议，欢迎提出Issue或Pull Request。