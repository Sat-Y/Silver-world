<script>
  // 不需要导入onMount了
  
  // 初始化保持为false，不使用localStorage存储
  let isAdmin = false;
  
  // 管理界面URL - 前端admin页面
  const adminURL = 'http://localhost:3000/admin/posts/';
  
  const openAdminPanel = () => {
    console.log('打开管理界面:', adminURL);
    window.open(adminURL, '_blank', 'width=1200,height=800,scrollbars=yes');
  };
  
  const handleAdminClick = () => {
    // 创建自定义密码输入对话框
    const createPasswordModal = () => {
      // 创建模态框容器
      const modal = document.createElement('div');
      modal.className = 'admin-password-modal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;
      
      // 创建对话框
      const dialog = document.createElement('div');
      dialog.className = 'admin-password-dialog';
      dialog.style.cssText = `
        background-color: white;
        border-radius: 8px;
        padding: 24px;
        width: 100%;
        max-width: 400px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      `;
      
      // 创建标题
      const title = document.createElement('h3');
      title.textContent = '管理员登录';
      title.style.cssText = `
        margin: 0 0 16px 0;
        font-size: 18px;
        font-weight: 600;
        color: #333;
      `;
      
      // 创建用户名标签和输入框
      const usernameLabel = document.createElement('label');
      usernameLabel.textContent = '管理员用户名:';
      usernameLabel.style.cssText = `
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #666;
      `;
      
      const usernameInput = document.createElement('input');
      usernameInput.type = 'text';
      usernameInput.placeholder = '请输入用户名';
      usernameInput.style.cssText = `
        width: 100%;
        padding: 10px 12px;
        margin-bottom: 16px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;
        transition: border-color 0.2s;
      `;
      usernameInput.addEventListener('focus', () => {
        usernameInput.style.borderColor = '#4a90e2';
      });
      usernameInput.addEventListener('blur', () => {
        usernameInput.style.borderColor = '#ddd';
      });
      
      // 创建密码标签和输入框
      const passwordLabel = document.createElement('label');
      passwordLabel.textContent = '管理员密码:';
      passwordLabel.style.cssText = `
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #666;
      `;
      
      const passwordInput = document.createElement('input');
      passwordInput.type = 'password'; // 设置为密码类型，输入内容显示为圆点
      passwordInput.placeholder = '请输入密码';
      passwordInput.style.cssText = `
        width: 100%;
        padding: 10px 12px;
        margin-bottom: 20px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;
        transition: border-color 0.2s;
      `;
      passwordInput.addEventListener('focus', () => {
        passwordInput.style.borderColor = '#4a90e2';
      });
      passwordInput.addEventListener('blur', () => {
        passwordInput.style.borderColor = '#ddd';
      });
      
      // 创建按钮容器
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      `;
      
      // 创建取消按钮
      const cancelButton = document.createElement('button');
      cancelButton.textContent = '取消';
      cancelButton.style.cssText = `
        padding: 8px 20px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background-color: white;
        color: #666;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      `;
      cancelButton.addEventListener('mouseover', () => {
        cancelButton.style.backgroundColor = '#f5f5f5';
      });
      cancelButton.addEventListener('mouseout', () => {
        cancelButton.style.backgroundColor = 'white';
      });
      
      // 创建确定按钮
      const confirmButton = document.createElement('button');
      confirmButton.textContent = '确定';
      confirmButton.style.cssText = `
        padding: 8px 20px;
        border: none;
        border-radius: 4px;
        background-color: #4a90e2;
        color: white;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.2s;
      `;
      confirmButton.addEventListener('mouseover', () => {
        confirmButton.style.backgroundColor = '#357abd';
      });
      confirmButton.addEventListener('mouseout', () => {
        confirmButton.style.backgroundColor = '#4a90e2';
      });
      
      // 添加元素到对话框
      dialog.appendChild(title);
      dialog.appendChild(usernameLabel);
      dialog.appendChild(usernameInput);
      dialog.appendChild(passwordLabel);
      dialog.appendChild(passwordInput);
      buttonContainer.appendChild(cancelButton);
      buttonContainer.appendChild(confirmButton);
      dialog.appendChild(buttonContainer);
      modal.appendChild(dialog);
      
      // 添加到文档
      document.body.appendChild(modal);
      
      // 自动聚焦到用户名输入框
      usernameInput.focus();
      
      return new Promise((resolve) => {
        // 取消按钮点击事件
        const handleCancel = () => {
          document.body.removeChild(modal);
          resolve({ username: null, password: null });
        };
        
        // 确定按钮点击事件
        const handleConfirm = () => {
          document.body.removeChild(modal);
          resolve({
            username: usernameInput.value,
            password: passwordInput.value
          });
        };
        
        // 绑定事件
        cancelButton.addEventListener('click', handleCancel);
        confirmButton.addEventListener('click', handleConfirm);
        
        // ESC键关闭模态框
        const handleEscape = (e) => {
          if (e.key === 'Escape') {
            handleCancel();
          }
        };
        document.addEventListener('keydown', handleEscape);
        
        // 点击模态框外部关闭
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            handleCancel();
          }
        });
        
        // 清理函数
        const cleanup = () => {
          document.removeEventListener('keydown', handleEscape);
        };
        
        // 当模态框被移除时清理事件监听器
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.removedNodes.forEach((node) => {
              if (node === modal) {
                cleanup();
                observer.disconnect();
              }
            });
          });
        });
        observer.observe(document.body, { childList: true });
      });
    };
    
    // 显示自定义密码对话框
    createPasswordModal().then(({ username, password }) => {
      if (username && password) {
        if (username === 'zyh' && password === '540838') {
          isAdmin = true; // 临时设置为true，仅用于当前会话
          openAdminPanel();
        } else {
          alert('登录失败，账号密码错误');
        }
      }
    });
  };
</script>

<button on:click={handleAdminClick} class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90" title="网站管理系统">
  <span class="text-[1.25rem]">🛠️</span>
</button>

<style>
  /* 已调整为与导航栏按钮一致的样式，主要通过btn-plain类实现 */
  /* 保留自定义图标大小设置 */
  span {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>