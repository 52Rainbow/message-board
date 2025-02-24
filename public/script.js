// 获取 DOM 元素
const nameSetup = document.getElementById('nameSetup');
const messageInput = document.getElementById('messageInput');
const userNameInput = document.getElementById('userName');
const setNameButton = document.getElementById('setNameButton');
const messageText = document.getElementById('messageText');
const submitMessageButton = document.getElementById('submitMessageButton');
const messagesList = document.getElementById('messages');

// 检查是否已设置用户名称
const savedUserName = localStorage.getItem('userName');
if (savedUserName) {
    // 如果已设置名称，隐藏名称设置界面，显示留言输入界面
    nameSetup.style.display = 'none';
    messageInput.style.display = 'block';
} else {
    // 如果未设置名称，显示名称设置界面
    nameSetup.style.display = 'block';
    messageInput.style.display = 'none';
}

// 设置用户名称
setNameButton.addEventListener('click', () => {
    const userName = userNameInput.value.trim();
    if (userName) {
        localStorage.setItem('userName', userName); // 保存名称到 localStorage
        nameSetup.style.display = 'none'; // 隐藏名称设置界面
        messageInput.style.display = 'block'; // 显示留言输入界面
    } else {
        alert('请输入名称');
    }
});

// 提交留言
submitMessageButton.addEventListener('click', async () => {
    const message = messageText.value.trim();
    const userName = localStorage.getItem('userName');

    if (message && userName) {
        // 调用 Netlify Function 提交留言
        const response = await fetch('/.netlify/functions/addMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, message })
        });

        if (response.ok) {
            messageText.value = ''; // 清空输入框
            loadMessages(); // 重新加载留言列表
        } else {
            alert('提交失败');
        }
    } else {
        alert('请输入留言');
    }
});

// 加载留言列表
async function loadMessages() {
    const response = await fetch('/.netlify/functions/getMessages');
    const messages = await response.json();
    messagesList.innerHTML = ''; // 清空当前列表

    messages.forEach(msg => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${msg.userName}</strong> (${msg.time}): ${msg.message}`;
        messagesList.appendChild(li);
    });
}

// 初始化时加载留言列表
loadMessages();