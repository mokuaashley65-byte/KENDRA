function toggleMenu(){
    const menu = document.querySelector('.nav-menu');
    menu.classList.toggle('active');
}

document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-menu').classList.remove('active');
  });})
