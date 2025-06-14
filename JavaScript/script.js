// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
  // 初始化导航和内容
  initNavigation();
  
  // 初始化粒子背景
  initParticles();
});

// 初始化导航
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const contents = document.querySelectorAll('.content');
  const sliderBar = document.querySelector('.slider-bar');
  
  // 更新滑块位置
  function updateSliderPosition() {
    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem && sliderBar) {
      const rect = activeItem.getBoundingClientRect();
      const containerRect = activeItem.parentElement.getBoundingClientRect();
      
      sliderBar.style.width = `${rect.width}px`;
      sliderBar.style.left = `${rect.left - containerRect.left}px`;
    }
  }
  
  // 显示内容
  function showContent(target) {
    contents.forEach(content => {
      content.classList.remove('active');
      if (content.id === target) {
        setTimeout(() => {
          content.classList.add('active');
          loadContent(target);
        }, 10);
      }
    });
    
    updateSliderPosition();
  }
  
  // 初始化滑块位置
  updateSliderPosition();
  
  // 添加导航点击事件
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      navItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      const target = this.getAttribute('data-target');
      showContent(target);
      
      // 添加波纹效果
      addRippleEffect(this, event);
    });
  });
  
  // 监听窗口大小变化
  window.addEventListener('resize', updateSliderPosition);
  
  // 返回顶部按钮功能
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// 添加波纹效果
function addRippleEffect(element, event) {
  const ripple = document.createElement('div');
  ripple.classList.add('ripple-effect');
  ripple.style.position = 'absolute';
  ripple.style.borderRadius = '50%';
  ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
  ripple.style.transform = 'scale(0)';
  ripple.style.animation = 'ripple 0.7s linear';
  
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size/2;
  const y = event.clientY - rect.top - size/2;
  
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  
  element.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 700);
}

// 初始化粒子背景
function initParticles() {
  particlesJS("particles-js", {
    particles: {
      number: { value: 40, density: { enable: true, value_area: 800 } },
      color: { value: "#03dac6" },
      shape: { type: "polygon", polygon: { nb_sides: 6 } },
      opacity: { value: 0.1, random: true },
      size: { value: 4, random: true },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#03dac6",
        opacity: 0.05,
        width: 1
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" },
        resize: true
      },
      modes: {
        grab: { distance: 140, line_linked: { opacity: 0.2 } },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  });
}