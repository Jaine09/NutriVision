document.addEventListener('DOMContentLoaded', function () {
    // MENU MOBILE
    const hamburger = document.getElementById('mobile-menu');
    const navbarList = document.querySelector('.navbar-list');
    const navbarButtons = document.querySelector('.navbar-buttons');

    hamburger.addEventListener('click', () => {
        navbarList.classList.toggle('active');
        navbarButtons.classList.toggle('active');
    });

    // SLIDER COM SETAS
    const slider = document.getElementById('slider');
    const leftArrow = document.getElementById('arrow-left');
    const rightArrow = document.getElementById('arrow-right');

    const cardWidth = 320; // largura do card + margem

    rightArrow?.addEventListener('click', () => {
        slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });

    leftArrow?.addEventListener('click', () => {
        slider.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });

    // FORMULÁRIO + MODAL
    const form = document.getElementById('form-contato');
    const modal = document.getElementById('modal-confirmacao');
    const closeBtn = document.querySelector('.fechar');

    if (form && modal && closeBtn) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

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
    }

});
