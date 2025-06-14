// 内容生成器
const contentGenerators = {
  // 卡片类型
  card: (item) => {
    return `
      <div class="content-card">
        <div class="card-header">
          <div class="card-icon">
            <i class="material-icons">${item.icon}</i>
          </div>
          <div>
            <div class="card-title">${item.title}</div>
            <div class="card-subtitle">${item.subtitle}</div>
          </div>
        </div>
        <div class="card-content">
          <p>${item.content}</p>
        </div>
        <div class="card-footer">
          <div class="tags">
            ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
          </div>
        </div>
      </div>
    `;
  },
  
  // 列表类型
  list: (item) => {
    return `
      <div class="content-list">
        <h3 class="list-title">${item.title}</h3>
        <ul class="styled-list">
          ${item.items.map(li => `<li>${li}</li>`).join('')}
        </ul>
      </div>
    `;
  },
  
  // 特色区块类型
  feature: (item) => {
    return `
      <div class="feature-block">
        <div class="feature-header">
          <i class="material-icons">${item.icon}</i>
          <h3>${item.title}</h3>
        </div>
        <div class="feature-grid">
          ${item.features.map(feature => `
            <div class="feature-item">
              <h4>${feature.title}</h4>
              <p>${feature.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },
  
  // 默认类型
  default: (item) => {
    return `
      <div class="default-block">
        <h3>${item.title || '未命名内容'}</h3>
        <p>${item.content || ''}</p>
      </div>
    `;
  }
};

// 加载内容
function loadContent(section) {
  const contentContainer = document.getElementById(section);
  
  fetch('data/data.json')
    .then(response => response.json())
    .then(data => {
      const sectionData = data[section];
      let html = `
        <p class="top">–=≡◆◇ ${sectionData.title} ◇◆≡=–</p>
        <h2>${sectionData.title}</h2>
        <p>${sectionData.subtitle}</p>
      `;
      
      // 根据type属性生成不同内容
      sectionData.content.forEach(item => {
        const generator = contentGenerators[item.type] || contentGenerators.default;
        html += generator(item);
      });
      
      contentContainer.innerHTML = html;
      initContentInteractions();
    })
    .catch(error => {
      console.error('加载内容失败:', error);
      contentContainer.innerHTML = `
        <div class="error">
          <p>加载内容失败，请刷新页面重试</p>
        </div>
      `;
    });
}

// 初始化内容交互
function initContentInteractions() {
  // 为所有卡片添加悬停效果
  document.querySelectorAll('.content-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px)';
      card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)';
    });
  });
  
  // 其他交互初始化...
}