document.addEventListener('DOMContentLoaded', function() {
  const navItems = document.querySelectorAll('.nav-item');
  const contents = document.querySelectorAll('.content');
  const sliderBar = document.querySelector('.slider-bar');

  if (!sliderBar) {
    console.error('Slider bar not found!');
  }

  function updateSliderPosition() {
    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem && sliderBar) {
      const rect = activeItem.getBoundingClientRect();
      sliderBar.style.width = `${rect.width}px`;
      sliderBar.style.left = `${rect.left}px`;
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

  updateSliderPosition();

  navItems.forEach(item => {
    item.addEventListener('click', function() {
      navItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      const target = this.getAttribute('data-target');
      showContent(target);
    });
  });

  window.addEventListener('resize', updateSliderPosition);
});