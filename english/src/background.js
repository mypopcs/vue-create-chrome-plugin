import { getData } from './db.js';

// 监听来自 content.js 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.contentScriptQuery === 'queryAllData') {
      getData('getAllWords').then(data => {
        // 查询成功，将数据发送回 content.js
        sendResponse({data: data});
      }).catch(error => {
        // 查询失败
        console.error('Error retrieving data:', error);
        sendResponse({error: error.message});
      });
      return true;  // Indicate that the response will be sent asynchronously
    } else if (request.contentScriptQuery === 'fetchWordData') {
      getData('targeID', request.wordId).then(data => {
        sendResponse({data: data});
      }).catch(error => {
        // 查询失败
        console.error('Error retrieving data:', error);
        sendResponse({error: error.message});
      });
      return true;
    }
  });