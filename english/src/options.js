// import { addData, readData, updateData, deleteData, getAllData } from './db.js';
import { getData,addData,deleteData,updateData} from './db.js';
//定义年月日格式
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const hour = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const customFormattedTime = `${year}-${month}-${day} ${hour}:${minutes}`;

//DOM元素
const wordForm = document.getElementById('wordForm');
const wordsTable = document.getElementById('wordsTable');
//空数据
const displayNoDataMessage = () => {
  const row = document.createElement('tr');
  row.innerText = '无数据';
  wordsTable.appendChild(row);
}
//插入单词到表格
const insertWordIntoTable = (word) => {
  if (word){
    const newRow = wordsTable.insertRow()
    newRow.innerHTML = `
    <td>${word.english}</td>
    <td>${word.chinese}</td>
    <td>${word.phonetic}</td>
    <td>${word.example}</td>
    <td>${word.difficulty}</td>
    <td>${word.examType}</td>
    <td>${word.createdTime}</td>
    <td>${word.updatedAt}</td>
    <td>
      <button class="edit-btn">编辑</button>
      <button class="delete-btn">删除</button>
    </td>
    `
    // 绑定删除和编辑按钮的点击事件
    const deleteBtn = newRow.querySelector('.delete-btn');
    const editBtn = newRow.querySelector('.edit-btn');
    //触发删除
    deleteBtn.addEventListener('click', function(){
      deleteWord(word.id);
    });
    //触发编辑
    editBtn.addEventListener('click', function(){
      editWord(word.id);
    });
  } else {
    console.error('Invalid word or word is null')
  }
}

//获取单词
const loadWords = async () => {
  const words = await getData('getAllWords');
  if (typeof words === 'object' && words.length !== 0){
    console.log('Loaded words:', words);
    Object.entries(words).forEach(([key, value]) => {
      if(key && value){
        insertWordIntoTable(value);
      } else {
        console.error('Encountered null or undefined key/value');
      }
    })
    // words.forEach(word => insertWordIntoTable(word))
  } else {
    displayNoDataMessage()
    console.log('没单词')
  }
}

//提交表单
const submitWord = () => {
  wordForm.addEventListener('submit', (event) => {
    event.preventDefault();// 阻止表单的默认提交事件
    const wordData = {
      english: document.getElementById('english').value.trim(),
      chinese: document.getElementById('chinese').value.trim(),
      phonetic: document.getElementById('phonetic').value.trim(),
      example: document.getElementById('example').value.trim(),
      difficulty: document.getElementById('difficulty').value.trim(),
      examRequirement: document.getElementById('examType').value.trim(),
      updatedAt:  '未更新',
    };
    //编辑状态
    if (window.currentEditingId) {
      wordData.id = window.currentEditingId;
      console.log('当前ID' + wordData.id)
      //更新时间
      wordData.updatedAt = customFormattedTime;
      updateData(wordData.id, wordData)
        .then(() => console.log('单词更新成功'))
        .catch(error => console.error('更新单词失败', error))
    } else { //新增状态
      wordData.id = String(Date.now()); //创建唯一id
      wordData.createdTime = customFormattedTime;
      addData(wordData)
        .then(() => console.log('单词创建成功'))
        .catch(error => console.error('创建单词失败', error))
        location.reload()
    }
  })
}
// //触发编辑
const editWord = (id) => {
  getData('targeID',id)
    .then(word => {
      document.getElementById('english').value = word.english;
      document.getElementById('chinese').value = word.chinese;
      document.getElementById('phonetic').value = word.phonetic;
      document.getElementById('example').value = word.example;
      document.getElementById('difficulty').value = word.difficulty;
      document.getElementById('examType').value = word.examRequirement;
      //获取创建时间
      window.currentEditingId = id;
    })
    .catch(error => console.error('Failed to load the word for editing', error))
}
//删除单词
const deleteWord = (id) => {
  if(deleteData(id)){
    console.error('删除成功')
    location.reload()
  } else {
    console.error('删除失败')
  }
};
//在文档加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  //加载单词
  loadWords();
  //提交表单
  submitWord();
});