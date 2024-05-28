// 自定义高亮显示的ID前缀
const highlightId = 'pt_id_';
// 指定要从文本匹配中排除的HTML标签列表
const excludeTags = ['script', 'style', 'textarea', 'input', 'button', 'img'];
// 创建浮动层（tooltip）用于显示数据
const tooltip = document.createElement('div');
document.body.appendChild(tooltip);
tooltip.style = `position: absolute; display: none; background-color: #fff; border: 1px solid #ccc; padding: 5px; z-index: 100;`
// 显示浮动层
const showTooltip = (e, htmlContent) => {
  tooltip.innerHTML = htmlContent; // 支持 HTML 内容的显示
  tooltip.style.display = 'block'; // 显示浮动层
  tooltip.style.left = `${e.pageX + 15}px`; // 根据鼠标位置定位浮动层
  tooltip.style.top = `${e.pageY + 15}px`;
};
// 隐藏浮动层
const hideTooltip = () => {
  tooltip.style.display = 'none';
};

// 异步获取数据，使用Promise确保数据获取后再执行后续操作
const fetchWord = async () => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ contentScriptQuery: 'queryAllData' }, response => {
      if (response.data) {
        // 转换数据只在这里处理一次
        const wordsData = response.data.map(wordObj => ({
          id: wordObj.id,
          word: wordObj.english,
          chinese: wordObj.chinese,
          level: wordObj.difficulty,
          example: wordObj.example,
          phonetic: wordObj.phonetic,
        }));
        resolve(wordsData); // 解析数据
      } else if (response.error) {
        reject(response.error); // 抛出错误
      }
    });
  });
};

const highlightWord = (wordsGroup) => {
  const wordMap = new Map();
  const collectTextNodes = (node) => {
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
      wordsGroup.forEach(item => {
        const wordLower = item.word.toLowerCase();
        const regex = new RegExp(`\\b${wordLower}\\b`, 'gi');
        let match;
        while ((match = regex.exec(node.nodeValue)) !== null) {
          if (!wordMap.has(wordLower)) {
            wordMap.set(wordLower, []);
          }
          const occurrences = wordMap.get(wordLower);
          if (occurrences.length < 10) {
            occurrences.push({
              ...item, // 展开item对象，存储所有信息
              node,
              match: match[0],
              position: match.index
            });
          }
        }
      });
    } else if (node.nodeType === Node.ELEMENT_NODE && !excludeTags.includes(node.tagName.toLowerCase())) {
      node.childNodes.forEach(collectTextNodes);
    }
  };

  // 从文档的根节点开始递归搜索和高亮单词
  collectTextNodes(document.body);

  // 对每个单词的匹配项随机选择并高亮显示
  wordMap.forEach((occurrences) => {
    if (occurrences.length > 0) {
      const selectedOccurrence = occurrences[Math.floor(Math.random() * occurrences.length)];
      if (selectedOccurrence.node.nodeValue && (selectedOccurrence.position + selectedOccurrence.match.length) <= selectedOccurrence.node.nodeValue.length) {
        // 高亮选定的匹配项
        const range = document.createRange();
        try {
          range.setStart(selectedOccurrence.node, selectedOccurrence.position);
          range.setEnd(selectedOccurrence.node, selectedOccurrence.position + selectedOccurrence.match.length);

          const highlightSpan = document.createElement('span');
          highlightSpan.classList.add('highlight');
          highlightSpan.textContent = selectedOccurrence.match;
          // 将选定匹配项的id设置为highlightSpan的id属性
          highlightSpan.id = selectedOccurrence.id; 
          range.deleteContents();
          range.insertNode(highlightSpan);

          highlightSpan.addEventListener('mouseover', (e) => {
            // 基于 selectedOccurrence 创建更丰富的HTML字符串
            const tooltipContent = `
              <div><strong>${selectedOccurrence.word}</strong>
              <div>中文：${selectedOccurrence.chinese}</div>
              <div>难度：${selectedOccurrence.level}</div>
              <div>例句：${selectedOccurrence.example}</div>
              <div>音标：${selectedOccurrence.phonetic}</div></div>`;
            showTooltip(e, tooltipContent);
          });
          highlightSpan.addEventListener('mouseout', hideTooltip);
        } catch (error) {
          console.error('Error setting range: ', error);
        }
      } else {
        console.warn(`Cannot highlight '${selectedOccurrence.match}' at position ${selectedOccurrence.position}: Node length is insufficient.`);
      }
    }
  });
}
// 使用获取到的数据进行操作
const init = async () => {
  try {
    const wordsData = await fetchWord(); // 等待数据
    console.log(wordsData);
    // 处理数据
    highlightWord(wordsData); // 高亮单词
  } catch (error) {
    console.error('Error:', error);
  }
};

if (document.readyState === 'loading') {
  // 当文档仍在加载时添加监听器
  document.addEventListener('DOMContentLoaded', init);
} else {
  // 如果文档已完成加载，直接调用函数
  init();
}