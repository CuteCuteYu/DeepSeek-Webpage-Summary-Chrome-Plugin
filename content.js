// 监听来自popup或background的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'extractContent') {
    // 提取页面内容
    const content = extractPageContent();
    // 发送提取的内容回调用者
    sendResponse({ content: content });
  }
  return true;
});

// 提取页面内容
function extractPageContent() {
  // 创建文档的克隆，避免修改原始文档
  const docClone = document.cloneNode(true);
  
  // 只移除真正不必要的元素类型
  const elementsToRemove = [
    'script',
    'style',
    'noscript',
    'iframe',
    'object',
    'embed',
    'canvas',
    'img',
    'video',
    'audio'
  ];
  
  // 移除不必要的元素
  elementsToRemove.forEach(tagName => {
    const elements = docClone.querySelectorAll(tagName);
    elements.forEach(el => el.remove());
  });
  
  // 智能提取主要内容，优先考虑常见的内容容器
  const mainContent = extractMainContent(docClone);
  
  // 清理文本
  let textContent = cleanText(mainContent);
  
  // 如果主要内容提取失败，使用body文本作为 fallback
  if (!textContent || textContent.length < 100) {
    textContent = cleanText(docClone.body.textContent || docClone.body.innerText || '');
  }
  
  // 限制文本长度，避免API请求过大
  const maxLength = 8000;
  if (textContent.length > maxLength) {
    textContent = textContent.substring(0, maxLength) + '...';
  }
  
  return textContent;
}

// 智能提取主要内容
function extractMainContent(doc) {
  // 常见的内容容器选择器
  const contentSelectors = [
    'main',
    '#main',
    '.main',
    '#content',
    '.content',
    '.article',
    '#article',
    '.post',
    '#post',
    '.entry',
    '#entry',
    '.blog-post',
    '.container',
    '.wrapper',
    'article',
    'section'
  ];
  
  // 尝试从常见的内容容器中提取内容
  for (const selector of contentSelectors) {
    const element = doc.querySelector(selector);
    if (element) {
      // 检查元素是否包含足够的文本内容
      const text = element.textContent || element.innerText || '';
      if (cleanText(text).length > 200) {
        return text;
      }
    }
  }
  
  // 尝试从所有段落中提取内容
  const paragraphs = doc.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
  if (paragraphs.length > 0) {
    let combinedText = '';
    paragraphs.forEach(p => {
      combinedText += p.textContent || p.innerText || '';
      combinedText += '\n';
    });
    return combinedText;
  }
  
  // 如果以上方法都失败，返回body文本
  return doc.body.textContent || doc.body.innerText || '';
}

// 清理文本内容
function cleanText(text) {
  // 移除多余的空白字符
  text = text.replace(/\s+/g, ' ');
  
  // 移除行首行尾的空白
  text = text.trim();
  
  // 移除连续的空行
  text = text.replace(/\n\s*\n/g, '\n\n');
  
  // 移除重复的空格
  text = text.replace(/ {2,}/g, ' ');
  
  return text;
}