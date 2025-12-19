// 监听来自popup或content脚本的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'summarize') {
    // 处理总结请求
    handleSummarizeRequest(request.content, sendResponse);
    return true; // 保持消息通道开放，以便异步响应
  }
});

// 处理总结请求
async function handleSummarizeRequest(content, sendResponse) {
  try {
    // 获取保存的API Key
    const apiKey = await getApiKey();
    
    if (!apiKey) {
      sendResponse({ 
        success: false, 
        error: '未找到API Key，请在插件设置中配置' 
      });
      return;
    }
    
    // 调用DeepSeek API进行总结
    const summary = await callDeepSeekApi(content, apiKey);
    
    // 发送成功响应
    sendResponse({ 
      success: true, 
      summary: summary 
    });
  } catch (error) {
    // 发送错误响应
    sendResponse({ 
      success: false, 
      error: error.message || '总结请求失败' 
    });
  }
}

// 获取API Key
function getApiKey() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['deepseekApiKey'], function(result) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        // 只返回存储的API Key，不提供默认值
        resolve(result.deepseekApiKey);
      }
    });
  });
}

// 调用DeepSeek API
async function callDeepSeekApi(content, apiKey) {
  // API请求URL
  const apiUrl = 'https://api.deepseek.com/chat/completions';
  
  // 构建请求体
  const requestBody = {
    model: 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content: '你是一个专业的中文总结助手，请将提供的网页内容进行简洁、准确的中文总结，突出重点内容。请务必使用美观的markdown格式输出，包括标题、列表、加粗等格式。'
      },
      {
        role: 'user',
        content: `请总结以下网页内容，使用美观的markdown格式输出：\n\n${content}`
      }
    ],
    stream: false
  };
  
  // 发送API请求
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  });
  
  // 检查响应状态
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API请求失败: ${errorData.error?.message || response.statusText}`);
  }
  
  // 解析响应数据
  const data = await response.json();
  
  // 提取总结结果
  if (data.choices && data.choices.length > 0) {
    return data.choices[0].message.content;
  } else {
    throw new Error('API响应格式错误，未找到总结结果');
  }
}