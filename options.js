// 页面加载完成后执行
 document.addEventListener('DOMContentLoaded', function() {
   // 加载当前保存的API Key
   loadApiKey();
   
   // 保存按钮事件监听
   document.getElementById('saveApiKey').addEventListener('click', saveApiKey);
   
   // 返回链接事件监听
   document.getElementById('backLink').addEventListener('click', function(e) {
     e.preventDefault();
     window.close(); // 关闭选项页面
   });
 });
 
 // 加载当前保存的API Key
 function loadApiKey() {
   chrome.storage.sync.get(['deepseekApiKey'], function(result) {
     if (result.deepseekApiKey) {
       document.getElementById('apiKey').value = result.deepseekApiKey;
     }
   });
 }
 
 // 保存API Key
 function saveApiKey() {
   const apiKey = document.getElementById('apiKey').value.trim();
   const messageDiv = document.getElementById('message');
   
   if (!apiKey) {
     // 显示错误消息
     messageDiv.textContent = '请输入有效的API Key';
     messageDiv.className = 'message error';
     messageDiv.style.display = 'block';
     return;
   }
   
   // 保存API Key到Chrome存储
   chrome.storage.sync.set({ deepseekApiKey: apiKey }, function() {
     // 显示成功消息
     messageDiv.textContent = 'API Key保存成功！';
     messageDiv.className = 'message success';
     messageDiv.style.display = 'block';
     
     // 3秒后隐藏消息
     setTimeout(function() {
       messageDiv.style.display = 'none';
     }, 3000);
   });
 }