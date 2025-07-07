// dynamic-loader.js
document.addEventListener('DOMContentLoaded', function () {
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
      memberCard.dataset.memberId = member.name.toLowerCase().replace(/\s+/g, '-');
      
      // 存储成员数据用于Canvas渲染
      memberCard.dataset.member = JSON.stringify(member);
      memberCard.dataset.theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';

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
      
      function getDeviceType() {
        const ua = navigator.userAgent;
        // 检测平板设备
        const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(ua);
      
        // 检测移动设备
        const isMobile = /(mobi|phone|android|ios|ipod|opera mini|windows phone|blackberry|iemobile)/i.test(ua);
      
        if (isTablet) return false;
        if (isMobile) return false;
        return true; // 默认桌面设备
      }
      
      // 生成联系方式HTML
      let contactHTML = '';
      if (member.contact) {
        if (member.contact.homepage) {
          contactHTML += `<p>首页: <a href="${member.contact.homepage}" target="_blank">${member.contact.homepage}</a></p>`;
        }
        if (member.contact.qq) {
          if (getDeviceType()) {
            contactHTML += `<p>QQ: <a href="tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&uin=${member.contact.qq}" target="_blank">${member.contact.qq}</a></p>`;
          } else {
            contactHTML += `<p>QQ: <a href="mqqwpa://im/chat?chat_type=wpa&uin=${member.contact.qq}&version=1&src_type=web" target="_blank">${member.contact.qq}</a></p>`;
          }
        }
        if (member.contact.email) {
          contactHTML += `<p>Email: <a href="mailto:${member.contact.email}" target="_blank">${member.contact.email}</a></p>`;
        }
        if (member.contact.x) {
          contactHTML += `<p>X: <a href="https://x.com/${member.contact.x}" target="_blank">@${member.contact.x}</a></p>`;
        }
        if (member.contact.discord) {
          contactHTML += `<p>Discord: <a href="https://discord.com/channels/@${member.contact.discord}" target="_blank">@${member.contact.discord}</a></p>`;
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
          <div class="detail-item render-item">
            <strong>导出卡片：</strong>
            <button class="render-button" data-member-id="${memberCard.dataset.memberId}">
              <i class="material-icons">image</i> 渲染为图片
            </button>
          </div>
        </div>
      `;

      memberGrid.appendChild(memberCard);
    });

    // 重新绑定成员卡片点击事件
    initMemberCardInteractions();

    // 绑定渲染按钮事件
    bindRenderButtons();
  }

  // 生成作品卡片
  function generateOpus(opusList) {
     opusGrid = document.querySelector('#opus .card-grid');
    if (!opusGrid) return;

    // 清空现有内容
    opusGrid.innerHTML = '';

    if (!opusList || opusList.length === 0) {
      opusGrid.innerHTML = '<div class="card"><p>暂无作品信息</p></div>';
      return;
    }

    opusList.forEach(opus => {
      let opusTemp = '';
let isDirectVideo = false;
let videoType = '';

if (opus.type === "image") {
  opusTemp = `<img src="${opus.url}" alt="${opus.title}" onerror="this.onerror=null;this.parentElement.classList.add('image-failed');">`;
} else if (opus.type === "video") {
  // 获取第一个有效URL
  const videoUrls = opus.url.split(' ').filter(url => url.trim() !== '');
  const videoUrl = videoUrls.length > 0 ? videoUrls[0] : '';
  
  // 检查是否为B站视频
  const isBilibili = videoUrl.includes('bilibili.com');
  
  // 检查是否为直接视频文件
  const videoFileExt = videoUrl.match(/\.(mp4|webm|ogg|mov)$/i);
  isDirectVideo = !!videoFileExt;
  videoType = videoFileExt ? videoFileExt[1].toLowerCase() : '';
  
  if (isBilibili) {
    // B站视频使用iframe嵌入
    opusTemp = `
            <div class="video-preview">
              <iframe src="${videoUrl}" frameborder="0" allowfullscreen></iframe>
            </div>
          `;
  } else if (isDirectVideo) {
    // 直接视频文件使用video标签
    opusTemp = `
            <div class="video-preview">
              <video>
                <source src="${videoUrl}" type="video/${videoType}">
              </video>
              <div class="play-icon">
                <i class="material-icons">play_circle</i>
              </div>
            </div>
          `;
  } else {
    // 其他类型显示为链接
    opusTemp = `
            <div class="video-preview">
              <div class="video-fallback"></div>
              <a href="${videoUrl}" target="_blank" class="video-link">
                <i class="material-icons">play_circle</i>
                <span>播放视频</span>
              </a>
            </div>
          `;
  }
} else if (opus.type === "music") {
  opusTemp = `<iframe src="//music.163.com/outchain/player?type=2&id=${opus.url}&auto=0&height=66" width="100%" height="85" frameborder="no" loading="lazy"></iframe>`;
}

const opusCard = document.createElement('div');
opusCard.className = 'card';

opusCard.innerHTML = `
      <div class="card-image">
        ${opusTemp}
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
      card.addEventListener('click', function () {
        this.classList.toggle('expanded');
        addRippleEffect(this, event);
      });
    });
  }

  // 初始化作品按钮交互
  function initOpusButtonInteractions() {
    const detailButtons = document.querySelectorAll('.detail-button');
    detailButtons.forEach(button => {
      button.addEventListener('click', function (event) {
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

  // 绑定渲染按钮事件
  function bindRenderButtons() {
    document.querySelectorAll('.render-button').forEach(button => {
      button.addEventListener('click', function () {
        const memberId = this.dataset.memberId;
        renderMemberCardAsImage(memberId);
      });
    });
  }

// 在renderMemberCardAsImage函数中替换Canvas绘制部分
function renderMemberCardAsImage(memberId) {
  const memberCard = document.querySelector(`.card.member[data-member-id="${memberId}"]`);
  if (!memberCard) return;

  // 获取存储的成员数据
  const member = JSON.parse(memberCard.dataset.member);
  const isDarkMode = memberCard.dataset.theme === 'dark';

  // 显示加载提示
  showToast('正在生成成员卡片...', 'info');

  try {
    // 创建Canvas元素
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置Canvas尺寸（360px宽，高度动态计算）
    const cardWidth = 360;
    const padding = 25;
    const sectionSpacing = 20;
    
    // 计算卡片高度
    let cardHeight = padding * 2; // 基础高度（不含首字母区域）
    
    // 成员信息高度
    cardHeight += 80;
    
    // 简介高度估算
    const introLinesH = wrapText(ctx, member.introduction || "No introduction provided", cardWidth - padding * 2, 14);
    cardHeight += introLinesH.length * 22;
    
    // 作品高度
    const worksCount = member.works ? member.works.length : 0;
    cardHeight += worksCount > 0 ? worksCount * 22 + 25 : 40;
    
    // 联系方式高度
    let contactCount = 0;
    if (member.contact) {
      if (member.contact.homepage) contactCount++;
      if (member.contact.qq) contactCount++;
      if (member.contact.email) contactCount++;
      if (member.contact.x) contactCount++;
      if (member.contact.discord) contactCount++;
    }
    cardHeight += contactCount > 0 ? contactCount * 22 + 25 : 40;
    
    // 添加顶部装饰区域高度
    cardHeight += 60;
    
    // 设置Canvas尺寸（2倍分辨率）
    canvas.width = cardWidth * 2;
    canvas.height = cardHeight * 2;
    ctx.scale(2, 2);
    
    // 设置主题颜色 - 科幻极简风格
    const colors = {
      background: "#0d1117",
      surface: "#161b22",
      text: "#f0f6fc",
      primary: "#58a6ff",
      secondary: "#1f6feb",
      accent: "#f78166",
      highlight: "#2ea043",
      divider: "#30363d"
    };
    
    // 绘制卡片背景 - 深空渐变
    const bgGradient = ctx.createLinearGradient(0, 0, cardWidth, cardHeight);
    bgGradient.addColorStop(0, "#0d1117");
    bgGradient.addColorStop(1, "#0a0d14");
    
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, cardWidth, cardHeight);
    
    // 绘制极简边框
    ctx.strokeStyle = colors.divider;
    ctx.lineWidth = 1;
    ctx.strokeRect(1, 1, cardWidth - 2, cardHeight - 2);
    
    // 绘制顶部装饰线
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 50);
    ctx.lineTo(cardWidth, 50);
    ctx.stroke();
    
    // 绘制标题文本
    ctx.fillStyle = colors.text;
    ctx.font = "bold 16px 'Roboto', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("ERA OF GEOMETRY", cardWidth / 2, 25);
    
    // 绘制成员ID
    ctx.fillStyle = colors.primary;
    ctx.font = "10px 'Roboto Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(`ID: ${memberId.toUpperCase()}`, cardWidth / 2, 40);
    
    // 绘制成员名称（居中显示）
    const infoY = 80;
    ctx.fillStyle = colors.text;
    ctx.font = "bold 22px 'Roboto', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(member.name, cardWidth / 2, infoY);
    
    // 绘制成员角色（居中显示）
    ctx.fillStyle = colors.primary;
    ctx.font = "14px 'Roboto', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(member.role, cardWidth / 2, infoY + 30);
    
    // 绘制分隔线 - 极简风格
    let currentY = infoY + 70;
    ctx.strokeStyle = colors.divider;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, currentY);
    ctx.lineTo(cardWidth - padding, currentY);
    ctx.stroke();
    
    // 绘制简介标题
    currentY += sectionSpacing;
    ctx.fillStyle = colors.text;
    ctx.font = "bold 14px 'Roboto', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("BIO", padding, currentY);
    
    // 绘制简介内容（自动换行）
    ctx.fillStyle = colors.text;
    ctx.font = "14px 'Roboto', sans-serif";
    const introLines = wrapText(ctx, member.introduction || "No introduction provided", cardWidth - padding * 2, 14);
    introLines.forEach(line => {
      currentY += 20;
      ctx.fillText(line, padding, currentY);
    });
    
    // 绘制作品标题
    currentY += sectionSpacing;
    ctx.fillStyle = colors.text;
    ctx.font = "bold 14px 'Roboto', sans-serif";
    ctx.fillText("WORKS", padding, currentY);
    
    // 绘制作品内容（自动换行）
    ctx.fillStyle = colors.text;
    ctx.font = "14px 'Roboto', sans-serif";
    if (member.works && member.works.length > 0) {
      member.works.forEach(work => {
        // 处理长标题自动换行
        const workLines = wrapText(ctx, "• " + work.title, cardWidth - padding * 2, 14);
        workLines.forEach(line => {
          currentY += 20;
          ctx.fillText(line, padding, currentY);
        });
      });
    } else {
      currentY += 20;
      ctx.fillText("No works listed", padding, currentY);
    }
    
    // 绘制联系方式标题
    currentY += sectionSpacing;
    ctx.fillStyle = colors.text;
    ctx.font = "bold 14px 'Roboto', sans-serif";
    ctx.fillText("CONTACT", padding, currentY);
    
    // 绘制联系方式内容（自动换行）
    ctx.fillStyle = colors.text;
    ctx.font = "14px 'Roboto', sans-serif";
    let hasContact = false;
    
    if (member.contact) {
      const contactItems = [
        { key: "homepage", prefix: "WEB: " },
        { key: "qq", prefix: "QQ: " },
        { key: "email", prefix: "MAIL: " },
        { key: "x", prefix: "X: @" },
        { key: "discord", prefix: "DISCORD: " }
      ];
      
      for (const item of contactItems) {
        if (member.contact[item.key]) {
          // 处理长联系方式自动换行
          const contactLines = wrapText(ctx, item.prefix + member.contact[item.key], cardWidth - padding * 2, 14);
          contactLines.forEach(line => {
            currentY += 20;
            ctx.fillText(line, padding, currentY);
          });
          hasContact = true;
        }
      }
    }
    
    if (!hasContact) {
      currentY += 20;
      ctx.fillText("No contact information", padding, currentY);
    }
    
    // 添加底部装饰
    const footerHeight = 30;
    ctx.fillStyle = colors.surface;
    ctx.fillRect(0, cardHeight - footerHeight, cardWidth, footerHeight);
    
    // 绘制底部文本
    ctx.fillStyle = colors.primary;
    ctx.font = "10px 'Roboto Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("EoG | " + new Date().toISOString().slice(0, 10), cardWidth / 2, cardHeight - footerHeight / 2);
    
    // 添加装饰性科技元素（可选）
    drawTechElements(ctx, cardWidth, cardHeight, colors);
    
    // 创建下载链接
    const link = document.createElement('a');
    link.download = `EoG-${member.name.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    // 显示成功提示
    showToast(`已生成 ${member.name} 的卡片`, 'success');
    
  } catch (error) {
    console.error('Canvas渲染失败:', error);
    showToast('卡片生成失败，请重试', 'error');
  }
}

// 添加科技元素装饰
function drawTechElements(ctx, cardWidth, cardHeight, colors) {
  
  // 绘制底部装饰线条
  ctx.strokeStyle = colors.divider;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const y = cardHeight - 20 + i * 3;
    ctx.moveTo(20, y);
    ctx.lineTo(cardWidth - 20, y);
  }
  ctx.stroke();
}

// 文本换行辅助函数（优化版）
function wrapText(ctx, text, maxWidth, fontSize) {
  ctx.font = `${fontSize}px 'Roboto', sans-serif`;
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? currentLine + ' ' + word : word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width <= maxWidth) {
      currentLine = testLine;
    } else {
      // 当前行已满，添加到结果
      if (currentLine) lines.push(currentLine);
      
      // 处理单个单词过长的情况
      if (ctx.measureText(word).width > maxWidth) {
        // 将过长的单词拆分为字符
        let tempWord = '';
        for (let j = 0; j < word.length; j++) {
          const char = word[j];
          const testChar = tempWord + char;
          if (ctx.measureText(testChar).width > maxWidth) {
            lines.push(tempWord);
            tempWord = char;
          } else {
            tempWord = testChar;
          }
        }
        currentLine = tempWord;
      } else {
        currentLine = word;
      }
    }
  }
  
  // 添加最后一行
  if (currentLine) lines.push(currentLine);
  
  return lines;
}

  // 显示Toast提示
  function showToast(message, type = 'info') {
    // 移除现有Toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    // 创建新Toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // 显示动画
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // 3秒后移除
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
});