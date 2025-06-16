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

    const botoesComprar = document.querySelectorAll('.comprar-btn');
    const modalPagamento = document.getElementById('modal-pagamento');
    const fecharPagamento = document.getElementById('fechar-pagamento');
    const produtoSelecionado = document.getElementById('produto-selecionado');
    const detalhesPagamento = document.getElementById('detalhes-pagamento');
    const formPagamento = document.getElementById('form-pagamento');
    const mensagemFinal = document.getElementById('mensagem-final');

    botoesComprar.forEach(botao => {
        botao.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            const img = card.querySelector('img');
            const src = img.getAttribute('src');

            produtoSelecionado.innerHTML = `<img src="${src}" alt="Produto selecionado" style="width:100%; max-height: 200px; object-fit: contain;">`;
            modalPagamento.style.display = 'flex';
        });
    });

    fecharPagamento.onclick = () => {
        modalPagamento.style.display = 'none';
        detalhesPagamento.innerHTML = '';
        formPagamento.reset();
        mensagemFinal.textContent = '';
    };

    window.addEventListener('click', (e) => {
        if (e.target === modalPagamento) {
            modalPagamento.style.display = 'none';
            detalhesPagamento.innerHTML = '';
            formPagamento.reset();
            mensagemFinal.textContent = '';
        }
    });

    formPagamento.addEventListener('change', (e) => {
        if (e.target.name === 'pagamento') {
            const metodo = e.target.value;
            detalhesPagamento.innerHTML = '';

            if (metodo === 'pix') {
                detalhesPagamento.innerHTML = `<p><strong>Chave PIX:</strong> nutri@vision.com.br</p><img src="./assets/img/qrcode_pix_ficticio.png" alt="QR Code PIX" style="width: 150px;">`;
            } else if (metodo === 'boleto') {
                detalhesPagamento.innerHTML = `<p>Linha digitável: <strong>34191.79001 01043.510047 91020.150008 5 12345678900000</strong></p>`;
            } else if (metodo === 'cartao') {
                detalhesPagamento.innerHTML = `
          <input type="text" placeholder="Número do Cartão" required>
          <input type="text" placeholder="Validade (MM/AA)" required>
          <input type="text" placeholder="CVV" required>
          <select required>
            <option disabled selected>Parcelamento</option>
            <option value="1">1x sem juros</option>
            <option value="2">2x sem juros</option>
            <option value="3">3x sem juros</option>
          </select>
        `;
                aplicarMascaraCartao(document.getElementById('numero-cartao'));
                aplicarMascaraValidade(document.getElementById('validade-cartao'));
                aplicarMascaraCVV(document.getElementById('cvv-cartao'));
            }
        }
    });

    formPagamento.addEventListener('submit', (e) => {
        e.preventDefault();
        mensagemFinal.textContent = 'Pagamento realizado com sucesso!';
        formPagamento.reset();
        detalhesPagamento.innerHTML = '';
        setTimeout(() => {
            modalPagamento.style.display = 'none';
            mensagemFinal.textContent = '';
        }, 3000);
    });
});

function aplicarMascaraCartao(input) {
    input.addEventListener('input', () => {
        let value = input.value.replace(/\D/g, '').slice(0, 16);
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        input.value = value;
    });
}

function aplicarMascaraValidade(input) {
    input.addEventListener('input', () => {
        let value = input.value.replace(/\D/g, '').slice(0, 4);
        if (value.length >= 3) {
            value = value.replace(/(\d{2})(\d{1,2})/, '$1/$2');
        }
        input.value = value;
    });
}

function aplicarMascaraCVV(input) {
    input.addEventListener('input', () => {
        input.value = input.value.replace(/\D/g, '').slice(0, 3);
    });
}

function aplicarMascaraAgencia(input) {
    input.addEventListener('input', () => {
        input.value = input.value.replace(/\D/g, '').slice(0, 4);
    });
}

function aplicarMascaraConta(input) {
    input.addEventListener('input', () => {
        input.value = input.value.replace(/\D/g, '').slice(0, 8);
    });
}
