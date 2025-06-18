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

    const comprarBtns = document.querySelectorAll('.comprar-btn');

    comprarBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        const card = this.closest('.card');
        const id = card.dataset.id; // Pegamos o ID do produto
        const img = card.querySelector('img').getAttribute('src');
        const nome = card.querySelector('h4').textContent.trim();

        let precoText = card.querySelector('p').textContent;
        precoText = precoText.replace(/[^\d,.-]+/g, '').replace(',', '.');
        const preco = parseFloat(precoText);

        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

        // Verifica se o produto já existe no carrinho pelo ID
        const produtoExistente = carrinho.find(p => p.id === id);

        if (produtoExistente) {
            produtoExistente.quantidade = (produtoExistente.quantidade || 1) + 1;
        } else {
            carrinho.push({
                id,
                img,
                nome,
                preco,
            });
        }

        localStorage.setItem('carrinho', JSON.stringify(carrinho));

        window.location.href = 'pages/pagamento.html?id=' + encodeURIComponent(id) +
            '&img=' + encodeURIComponent(img) +
            '&nome=' + encodeURIComponent(nome) +
            '&preco=' + encodeURIComponent(preco);
    });
})
});