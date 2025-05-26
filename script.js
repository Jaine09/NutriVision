document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navbarMenu = document.getElementById('navbar-menu');

    if (mobileMenu && navbarMenu) {
        mobileMenu.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
        });

        // Opcional: Fechar o menu ao clicar em um item (para navegação suave)
        const navLinks = document.querySelectorAll('.navbar-item a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navbarMenu.classList.contains('active')) {
                    navbarMenu.classList.remove('active');
                }
            });
        });
    }
});