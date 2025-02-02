window.addEventListener('load', () => {
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero');

    if (window.scrollY < heroSection.offsetHeight) {
        navbar.classList.add('transparent');
    }
});

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero');

    if (window.scrollY >= heroSection.offsetHeight) {
        navbar.classList.remove('transparent');
    } else {
        navbar.classList.add('transparent');
    }
});
