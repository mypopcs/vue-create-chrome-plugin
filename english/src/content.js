// window.onload=()=> {
//   // 从后台获取单词数据库
//   chrome.runtime.sendMessage({ action: 'getWords' }, function(response) {
//     console.log('收到后台响应:', response);
//       const words = response || [];
//       console.log(words)
//       words.forEach(wordObj => {
//         console.log(words)
//           const regex = new RegExp(`\\b${wordObj.word}\\b`, 'gi');
//           console.log(regex)
//           const replacement = `<span style="font-weight: bold; color: red;">${wordObj.word}</span>`;
//           document.body.innerHTML = document.body.innerHTML.replace(regex, replacement);
//       });
//   });
// }
// window.onload= async()=> {
//   chrome.runtime.sendMessage({action: 'readAllData'}, response => {
//     console.log(response.words)
//     // if(response.words) {
//     //   // 使用从背景脚本返回的数据
//     //   const words = response.words;
//     //   console.log(words)
//     // } else if (response.error) {
//     //   console.error('Failed to read data from background script:', response.error);
//     // }
//   })
// }
chrome.runtime.sendMessage({action: 'readAllData'}, response => {
  console.log(response.farewell)
})

// const loadWords = () => {
//   console.log('执行数据获取')
//   window.localstore.readAllData()
//       .then(words => {
//         console.log(words)
//         if (words.length > 0){
//           words.forEach(word => insertWordIntoTable(word));
//         } else {
//           // 如果没有数据，则显示"无数据"的提示
//           displayNoDataMessage();
//         }
//       })
//       .catch(error => console.error('Failed to load words', error));
// };