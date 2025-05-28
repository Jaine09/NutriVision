document.addEventListener('DOMContentLoaded', function () {
    const mobileMenu = document.getElementById('mobile-menu');
    const navbarMenu = document.getElementById('navbar-menu');

    if (mobileMenu && navbarMenu) {
        mobileMenu.addEventListener('click', function () {
            navbarMenu.classList.toggle('active');
        });

        const navLinks = document.querySelectorAll('.navbar-item a');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                if (navbarMenu.classList.contains('active')) {
                    navbarMenu.classList.remove('active');
                }
            });
        });
    }

    // Slider com setas e indicadores
    const slider = document.getElementById('slider');
    const leftArrow = document.getElementById('arrow-left');
    const rightArrow = document.getElementById('arrow-right');

    let scrollAmount = 0;
    const cardWidth = 320; // largura do card + margem

    rightArrow.addEventListener('click', () => {
        slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });

    leftArrow.addEventListener('click', () => {
        slider.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });

    const form = document.getElementById('form-contato');
    const modal = document.getElementById('modal-confirmacao');
    const closeBtn = document.querySelector('.fechar');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Simula envio com um delay
        setTimeout(() => {
            form.reset();
            modal.style.display = 'block';
        }, 500);
    });

    closeBtn.onclick = () => {
        modal.style.display = "none";
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
});
