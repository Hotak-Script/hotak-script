function toggleMenu(){
    const menu = document.querySelector('.ul');
    menu.classList.toggle('show');
    const hamburger = document.querySelector('.miniHamburger');
    hamburger.classList.toggle('active');
    if(hamburger.classList.contains('active')){
            hamburger.children[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            hamburger.children[1].style.opacity = '0';
            hamburger.children[2].style.transform = 'rotate(-45deg) translate(5px, -5px)'
    } else{
        hamburger.children[0].style.transform = 'rotate(0) translate(0, 0)';
        hamburger.children[1].style.opacity = '1';
        hamburger.children[2].style.transform = 'rotate(0) translate(0, 0)';
    }
}