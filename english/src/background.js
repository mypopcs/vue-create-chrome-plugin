// console.log('123232')
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     console.log('执行数据获取')
//     if(request.action === "readAllData"){
//         sendResponse({
//             farewell: 'good'
//         })
//         window.localstore.readAllData()
//         .then(words => {
//             console.log(words)
//         })
//         .catch(error => console.error('Failed to load words', error));
//     }
//     // window.localstore.readAllData()
//     //     .then(words => {
//     //         console.log(words)
//     //         if (words.length > 0){
//     //         words.forEach(word => insertWordIntoTable(word));
//     //         } else {
//     //         // 如果没有数据，则显示"无数据"的提示
//     //         displayNoDataMessage();
//     //         }
//     //     })
//     //     .catch(error => console.error('Failed to load words', error));
// })
//     // chrome.runtime.getBackgroundPage(  (backgroundPage) => {
//     //     if(backgroundPage.readAllData){
//     //         backgroundPage.readAllData().then(data => {
//     //             console.log('All data:', data);
//     //         }).catch(error => {
//     //             console.error('Error reading data:', error);
//     //         });
//     //     } else {
//     //         console.log('readAllData function not found in the background page');
//     //     }
//     // })
//     // if (request.action === "readAllData") {
//     //     chrome.runtime.getBackgroundPage(  (backgroundPage) => {
//     //         if(backgroundPage.readAllData){
//     //             backgroundPage.readAllData().then(data => {
//     //                 console.log('All data:', data);
//     //             }).catch(error => {
//     //                 console.error('Error reading data:', error);
//     //             });
//     //         } else {
//     //             console.log('readAllData function not found in the background page');
//     //         }
//     //     })
//     //     // window.localStorage.readAllData()
//     //     //     .then(words => sendResponse({words}))
//     //     //     .catch(error => sendResponse({error}));
//     //     // return true; // 必须返回true以保持连接直到sendResponse被调用
//     // }
