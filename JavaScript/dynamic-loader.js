document.addEventListener('DOMContentLoaded', function() {
  // 加载JSON数据
  fetch('./data/data.json')
    .then(response => response.json())
    .then(data => {
      // 生成公告内容
      generateAnnouncements(data.announcements);
      
      // 生成成员卡片
      generateMembers(data.members);
      
      // 生成作品卡片
      generateOpus(data.opus);
      
      // 生成项目卡片
      generateProjects(data.projects);
    })
    .catch(error => {
      console.error('加载数据失败:', error);
      showFallbackContent();
    });
  
  // 生成公告内容
  function generateAnnouncements(announcements) {
    const announcementList = document.querySelector('.announcement-list');
    if (!announcementList) return;
    
    // 清空现有内容
    announcementList.innerHTML = '';
    
    if (!announcements || announcements.length === 0) {
      announcementList.innerHTML = '<div class="announcement"><p>暂无公告</p></div>';
      return;
    }
    
    announcements.forEach(announcement => {
      const announcementElement = document.createElement('div');
      announcementElement.className = 'announcement';
      if (announcement.sticky) {
        announcementElement.classList.add('sticky');
      }
      
      announcementElement.innerHTML = `
        <div class="announcement-date">${announcement.date}</div>
        <h3 class="announcement-title">${announcement.title}</h3>
        <p class="announcement-content">${announcement.content}</p>
      `;
      
      announcementList.appendChild(announcementElement);
    });
  }
  
  // 生成成员卡片
  function generateMembers(members) {
    const memberGrid = document.querySelector('#member .card-grid');
    if (!memberGrid) return;
    
    // 清空现有内容
    memberGrid.innerHTML = '';
    
    if (!members || members.length === 0) {
      memberGrid.innerHTML = '<div class="card"><p>暂无成员信息</p></div>';
      return;
    }
    
    members.forEach(member => {
      const memberCard = document.createElement('div');
      memberCard.className = 'card member';
      
      // 生成作品列表HTML
      let worksHTML = '';
      if (member.works && member.works.length > 0) {
        worksHTML = '<ul>';
        member.works.forEach(work => {
          worksHTML += `<li><a href="${work.url}" target="_blank">${work.title}</a></li>`;
        });
        worksHTML += '</ul>';
      } else {
        worksHTML = '<p>暂无</p>';
      }
      
      // 生成联系方式HTML
      let contactHTML = '';
      if (member.contact) {
        if (member.contact.homepage) {
          contactHTML += `<p>首页: <a href="${member.contact.homepage}" target="_blank">${member.contact.homepage}</a></p>`;
        }
        if (member.contact.qq) {
          contactHTML += `<p>QQ: ${member.contact.qq}</p>`;
        }
        if (member.contact.email) {
          contactHTML += `<p>Email: ${member.contact.email}</p>`;
        }
      }
      
      if (!contactHTML) {
        contactHTML = '<p>暂无可用联系方式</p>';
      }
      
      memberCard.innerHTML = `
        <div class="member-card">
          <div class="member-avatar"><img alt="${member.name.charAt(0)}" src="${member.avatar}" onerror="this.src='images/default-avatar.png'"></div>
          <div class="member-info">
            <div class="member-name">${member.name}</div>
            <div class="member-role">${member.role}</div>
          </div>
          <i class="material-icons dropdown-arrow">expand_more</i>
        </div>
        <div class="member-details">
          <div class="detail-item">
            <strong>简介：</strong>
            <p>${member.introduction}</p>
          </div>
          <div class="detail-item">
            <strong>作品：</strong>
            ${worksHTML}
          </div>
          <div class="detail-item">
            <strong>联系方式：</strong>
            ${contactHTML}
          </div>
        </div>
      `;
      
      memberGrid.appendChild(memberCard);
    });
    
    // 重新绑定成员卡片点击事件
    initMemberCardInteractions();
  }
  
  // 生成作品卡片
  function generateOpus(opusList) {
    const opusGrid = document.querySelector('#opus .card-grid');
    if (!opusGrid) return;
    
    // 清空现有内容
    opusGrid.innerHTML = '';
    
    if (!opusList || opusList.length === 0) {
      opusGrid.innerHTML = '<div class="card"><p>暂无作品信息</p></div>';
      return;
    }
    
    opusList.forEach(opus => {
      const opusCard = document.createElement('div');
      opusCard.className = 'card';
      
      opusCard.innerHTML = `
      <div class="card-image">
        <img src="${opus.image}" alt="${opus.title}" onerror="this.onerror=null;this.parentElement.classList.add('image-failed');">
        <div class="image-fallback"></div>
      </div>
      <div class="card-content">
        <h3>${opus.title}</h3>
        <p>${opus.description}</p>
        <div class="card-actions">
          <a href="${opus.detailUrl}" class="detail-button ripple" target="_blank">查看详情</a>
        </div>
      </div>
    `;
      
      opusGrid.appendChild(opusCard);
    });
    
    // 绑定作品按钮波纹效果
    initOpusButtonInteractions();
  }
  
  // 生成项目卡片
  function generateProjects(projects) {
    const projectGrid = document.querySelector('#project .card-grid');
    if (!projectGrid) return;
    
    // 清空现有内容
    projectGrid.innerHTML = '';
    
    if (!projects || projects.length === 0) {
      projectGrid.innerHTML = '<div class="card"><p>暂无项目信息</p></div>';
      return;
    }
    
    projects.forEach(project => {
      const projectCard = document.createElement('div');
      projectCard.className = 'card';
      
      // 根据进度自动生成颜色
      const progressColor = getProgressColor(project.progress);
      
      // 使用与作品卡片相同的图片处理逻辑
      let imageHTML = `
      <div class="card-image">
        <img src="${project.image || ''}" alt="${project.title}" 
             onerror="this.onerror=null;this.parentElement.classList.add('image-failed');">
        <div class="image-fallback"></div>
    `;
      
      // 添加项目状态条（保持在图片容器内）
      imageHTML += `
        <div class="project-status">
          <div class="status-bar" style="width: ${project.progress}%; background-color: ${progressColor};"></div>
          <div class="status-text">项目进度 (${project.progress}%)</div>
        </div>
      </div>
    `;
      
      projectCard.innerHTML = `
      ${imageHTML}
      <div class="card-content">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
      </div>
    `;
      
      projectGrid.appendChild(projectCard);
    });
  }
  
  // 根据进度值获取颜色
  function getProgressColor(progress) {
    if (progress < 20) return '#ff5252'; // 红色
    if (progress < 50) return '#ffb300'; // 橙色
    if (progress < 80) return '#00b0ff'; // 蓝色
    return '#4caf50'; // 绿色
  }
  
  // 初始化成员卡片交互
  function initMemberCardInteractions() {
    const memberCards = document.querySelectorAll('.member-card');
    memberCards.forEach(card => {
      card.addEventListener('click', function() {
        this.classList.toggle('expanded');
        addRippleEffect(this, event);
      });
    });
  }
  
  // 初始化作品按钮交互
  function initOpusButtonInteractions() {
    const detailButtons = document.querySelectorAll('.detail-button');
    detailButtons.forEach(button => {
      button.addEventListener('click', function(event) {
        addRippleEffect(this, event);
      });
    });
  }
  
  // 添加波纹效果
  function addRippleEffect(element, event) {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple-effect');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 700);
  }
  
  // 数据加载失败时显示回退内容
  function showFallbackContent() {
    alert('数据加载失败，请刷新。');
  }
});