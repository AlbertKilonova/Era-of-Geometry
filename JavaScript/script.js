document.addEventListener('DOMContentLoaded', function() {
  const navItems = document.querySelectorAll('.nav-item');
  const contents = document.querySelectorAll('.content');
  const sliderBar = document.querySelector('.slider-bar');
  const backToTopBtn = document.getElementById('backToTop');
  const themeToggle = document.getElementById('themeToggle');
  
  // 获取标题元素
  const titleElement = document.getElementById('title');
  
  // 检查本地存储中的暗色模式设置
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="material-icons">light_mode</i>';
  }
  
  // 切换暗色模式
  themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    
    // 更新图标
    if (document.body.classList.contains('dark-mode')) {
      themeToggle.innerHTML = '<i class="material-icons">light_mode</i>';
      localStorage.setItem('darkMode', 'true');
    } else {
      themeToggle.innerHTML = '<i class="material-icons">dark_mode</i>';
      localStorage.setItem('darkMode', 'false');
    }
    
    // 添加波纹效果
    const ripple = document.createElement('div');
    ripple.classList.add('ripple-effect');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    this.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 700);
  });
  
  // 导航功能
  function updateSliderPosition() {
    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem && sliderBar) {
      const rect = activeItem.getBoundingClientRect();
      const containerRect = activeItem.parentElement.getBoundingClientRect();
      
      sliderBar.style.width = `${rect.width}px`;
      sliderBar.style.left = `${rect.left - containerRect.left}px`;
    }
  }
  
  function showContent(target) {
    contents.forEach(content => {
      if (content.id === target) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
    updateSliderPosition();
  }
  
  // 初始化
  updateSliderPosition();
  
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      navItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      const target = this.getAttribute('data-target');
      showContent(target);
      
      // 添加波纹效果
      const ripple = document.createElement('div');
      ripple.classList.add('ripple-effect');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 700);
    });
  });
  
  window.addEventListener('resize', updateSliderPosition);
  
  // 返回顶部按钮功能
  if (backToTopBtn) {
    // 添加波纹容器
    const rippleContainer = document.createElement('div');
    rippleContainer.classList.add('ripple-container');
    backToTopBtn.appendChild(rippleContainer);
    
    // 监听滚动事件
    window.addEventListener('scroll', function() {
      checkTitleVisibility();
    });
    
    // 点击返回顶部
    backToTopBtn.addEventListener('click', function(event) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // 添加波纹效果
      const ripple = document.createElement('div');
      ripple.classList.add('ripple-effect');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.5;
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      rippleContainer.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 700);
    });
  }
  
  // 添加标题位置检测
  function checkTitleVisibility() {
    if (!titleElement || !backToTopBtn) return;
    
    const titleRect = titleElement.getBoundingClientRect();
    
    // 如果标题移出视口顶部，显示返回顶部按钮
    if (titleRect.bottom < 0) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
  
  // 初始检查
  checkTitleVisibility();
  
// 成员卡片下拉功能
const memberCards = document.querySelectorAll('.member-card');
memberCards.forEach(card => {
  card.addEventListener('click', function() {
    // 切换展开状态
    this.classList.toggle('expanded');
    
    // 添加波纹效果
    const ripple = document.createElement('div');
    ripple.classList.add('ripple-effect');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    this.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 700);
  });
});
});