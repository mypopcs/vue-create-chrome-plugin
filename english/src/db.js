// 定义数据库配置
const DB_NAME = 'myDatabase';
const DB_VERSION = 1;
const STORE_NAME = 'myObjectStore';

//打开数据库
const openDB = () => new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    // 在数据库打开过程中遇到错误时触发。
    request.onerror = (event) => {
        // 将错误原因作为 Promise 的拒绝原因。
        reject('Database error: ' + event.target.error);
    };
    request.onsuccess = event => {
        resolve(event.target.result);
    };
    // 当数据库需要升级时触发(例如，当你第一次运行或者你指定了一个更高版本号)。
    request.onupgradeneeded = event => {
        const db = event.target.result;
        // 检查是否存在 objectStore（对象仓库），不存在就创建一个新的。
        if (!db.objectStoreNames.contains(STORE_NAME)){
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
    };
});
//查询所有数据
export const getData = async (getType, key) => {
    // 等待数据库打开，或者立即得到数据库的引用
    const db = await openDB();
    // 开始一个读取事务。
    const transaction = db.transaction([STORE_NAME], 'readonly')
    // 获取对象仓库的引用。
    const store = transaction.objectStore(STORE_NAME);
    let result;
    if(getType === 'all'){
        try {
            // 请求所有数据
            const request = store.getAll();
            result = await new Promise((resolve, reject) => {
                request.onsuccess = event => resolve(event.target.result);
                request.onerror = event => {reject(event.target.error);};
            });
            console.log(result)
        } catch (error) {
            console.error('获取所有数据时出错:', error);
            throw error; // 重新抛出错误，以便外部可以处理
        }
    } else if(getType === 'targeID'){
        const request = store.get(key);
        result = await new Promise((resolve, reject) => {
            request.onsuccess = event => resolve(event.target.result);
            request.onerror = event => {reject(event.target.error);};
        });
    } else {
        throw new Error('Invalid getType value');
    }
    return result; // 返回解决结果，即我们的数据。
}
// //增加数据
export const addData = async (id, dataObject) => {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(id, dataObject);
    request.onsuccess = () => console.log('Data added successfully');
    request.onerror = () => console.error('Failed to add data', request.error);
    return transaction.complete;
}
//更新数据
export const updateData = async (key, newData) => {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request  = await store.get(key);
    request.onsuccess = (event) => {
        const data = event.target.result;
        console.log('获取到的data' + data)
        if (data) {
            Object.keys(newData).forEach(prop => {
                data[prop] = newData[prop];
            });
            const putRequest = store.put(data);
            putRequest.onsuccess = () => console.log('Data updated successfully');
            putRequest.onerror = () => console.error('Failed to update data', putRequest.error);
        } else {
            console.log("No data found for key:", key);
        }
    }
    request.onerror = (event) => {
        console.error('数据获取失败', event.target.error);
    };
    await transaction.complete;
    // console.log('获取到的key：' + key + '；获取到的data' + data)
}
//删除数据
export const deleteData = async (key) => {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(key);
    await transaction.complete;
}