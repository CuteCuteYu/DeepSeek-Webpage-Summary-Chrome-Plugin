// 页面加载完成后执行
 document.addEventListener('DOMContentLoaded', function() {
   // 检查是否已保存API Key
   checkApiKey();
   
   // 保存API Key按钮事件监听
   document.getElementById('saveApiKey').addEventListener('click', saveApiKey);
   
   // 总结按钮事件监听
   document.getElementById('summarizeBtn').addEventListener('click', summarizePage);
 });
 
 // 检查是否已保存API Key
 function checkApiKey() {
   chrome.storage.sync.get(['deepseekApiKey'], function(result) {
     if (result.deepseekApiKey) {
       // 如果已保存，隐藏API Key输入区域，显示总结区域
       document.getElementById('apiKeySection').style.display = 'none';
       document.getElementById('summarySection').style.display = 'block';
     }
   });
 }
 
 // 保存API Key
 function saveApiKey() {
   const apiKey = document.getElementById('apiKey').value.trim();
   const messageDiv = document.getElementById('apiKeyMessage');
   
   if (!apiKey) {
     messageDiv.textContent = '请输入有效的API Key';
     messageDiv.style.color = 'red';
     return;
   }
   
   // 保存API Key到Chrome存储
   chrome.storage.sync.set({ deepseekApiKey: apiKey }, function() {
     messageDiv.textContent = 'API Key保存成功！';
     messageDiv.style.color = 'green';
     
     // 延迟显示总结区域
     setTimeout(function() {
       document.getElementById('apiKeySection').style.display = 'none';
       document.getElementById('summarySection').style.display = 'block';
     }, 1000);
   });
 }
 
 // 总结当前页面
 function summarizePage() {
   const loadingDiv = document.getElementById('loading');
   const errorDiv = document.getElementById('error');
   const resultDiv = document.getElementById('result');
   const summarizeBtn = document.getElementById('summarizeBtn');
   
   // 重置状态
   errorDiv.style.display = 'none';
   resultDiv.textContent = '';
   
   // 显示加载状态
   loadingDiv.style.display = 'block';
   summarizeBtn.disabled = true;
   
   // 获取当前激活的标签页
   chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
     const tab = tabs[0];
     
     // 向content脚本发送消息，提取页面内容
     chrome.scripting.executeScript({
       target: { tabId: tab.id },
       files: ['content.js']
     }, function() {
       // 发送提取内容的请求
       chrome.tabs.sendMessage(tab.id, { action: 'extractContent' }, function(response) {
         if (chrome.runtime.lastError) {
           handleError('无法访问页面内容：' + chrome.runtime.lastError.message);
           return;
         }
         
         if (!response || !response.content) {
           handleError('无法提取页面内容');
           return;
         }
         
         // 将提取的内容发送到background脚本进行总结
         chrome.runtime.sendMessage({
           action: 'summarize',
           content: response.content
         }, function(summaryResponse) {
           loadingDiv.style.display = 'none';
           summarizeBtn.disabled = false;
           
           if (chrome.runtime.lastError) {
             handleError('总结失败：' + chrome.runtime.lastError.message);
             return;
           }
           
           if (summaryResponse && summaryResponse.success) {
             // 使用marked.js渲染markdown内容
             const html = marked.parse(summaryResponse.summary);
             resultDiv.innerHTML = html;
           } else {
             handleError('总结失败：' + (summaryResponse.error || '未知错误'));
           }
         });
       });
     });
   });
 }
 
 // 处理错误
 function handleError(errorMessage) {
   const loadingDiv = document.getElementById('loading');
   const errorDiv = document.getElementById('error');
   const summarizeBtn = document.getElementById('summarizeBtn');
   
   loadingDiv.style.display = 'none';
   errorDiv.textContent = errorMessage;
   errorDiv.style.display = 'block';
   summarizeBtn.disabled = false;
 }