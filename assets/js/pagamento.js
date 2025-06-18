document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const img = urlParams.get('img');
    const nome = urlParams.get('nome');
    const precoString = urlParams.get('preco')?.replace(',', '.');
    const preco = parseFloat(precoString);

    if (img && nome && !isNaN(preco)) {
        const chaveProduto = `adicionado_${nome}`;

        if (!sessionStorage.getItem(chaveProduto)) {
            const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

            const nomeProduto = decodeURIComponent(nome).trim().toLowerCase();
            const novoProduto = {
                img: decodeURIComponent(img),
                nome: nomeProduto,
                preco: preco,
                quantidade: 1
            };

            const existente = carrinho.find(p => p.nome.trim().toLowerCase() === nomeProduto);

            if (existente) {
                existente.quantidade += 1;
                existente.preco = novoProduto.preco;
            } else {
                carrinho.push(novoProduto);
            }

            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            sessionStorage.setItem(chaveProduto, 'true');
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }



    renderizarCarrinho();

    // CEP (frete)
    const cepInput = document.getElementById('cep');
    const freteTexto = document.querySelector('.frete');
    const calcularBtn = document.getElementById('calcular');

    freteTexto.textContent = 'Calcular frete';

    calcularBtn.addEventListener('click', () => {
        const cep = cepInput.value.replace(/\D/g, '');
        if (cep.length !== 8) {
            alert('Digite um CEP válido com 8 dígitos.');
            return;
        }

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(res => res.json())
            .then(data => {
                if (data.erro) {
                    alert('CEP não encontrado.');
                    return;
                }

                freteTexto.textContent = '🚚 Frete Grátis';
            })
            .catch(() => {
                alert('Erro ao buscar o CEP.');
            });
    });

    // Pagamento
    const selectPagamento = document.getElementById('pagamento');
    const detalhesPagamento = document.getElementById('detalhes-pagamento');
    const finalizarBtn = document.querySelector('.finalizar');

    selectPagamento.addEventListener('change', () => {
        const tipo = selectPagamento.value;
        detalhesPagamento.innerHTML = '';

        if (tipo === 'credito' || tipo === 'debito') {
            detalhesPagamento.innerHTML = `
                <input id="num-cartao" type="text" placeholder="Número do cartão" maxlength="19">
                <input id="validade-cartao" type="text" placeholder="Validade (MM/AA)" maxlength="5">
                <input id="cvv-cartao" type="text" placeholder="CVV" maxlength="3">
            `;
            aplicarMascarasCartao();
        } else if (tipo === 'pix') {
            detalhesPagamento.innerHTML = `
                <img src="../assets/img/qrcode_pix_ficticio.png" alt="QR Code PIX" id="qrcode"></img>
                <label>Escaneie o QR Code para pagar:</label>
            `;
        } else if (tipo === 'boleto') {
            detalhesPagamento.innerHTML = `
                <p>Escanei o código de barra abaixo ou gere o boleto para pagamento:</p>
                <img src="../assets/img/codigoBarra.png" alt="Código de Barras do Boleto" id="codigo-barras">
                <p>Clique abaixo para gerar seu boleto:</p>
                <button onclick="gerarBoletoPDF()" id="boleto">Gerar Boleto PDF</button>
            `;
        }
    });

    function aplicarMascarasCartao() {
        const num = document.getElementById('num-cartao');
        const validade = document.getElementById('validade-cartao');

        num.addEventListener('input', () => {
            let valor = num.value.replace(/\D/g, '').slice(0, 16);
            valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
            num.value = valor;
        });

        validade.addEventListener('input', () => {
            let valor = validade.value.replace(/\D/g, '').slice(0, 4);
            if (valor.length >= 3) valor = valor.slice(0, 2) + '/' + valor.slice(2);
            validade.value = valor;
        });
    }

    finalizarBtn.addEventListener('click', () => {
        const metodo = selectPagamento.value;

        if (!metodo) {
            alert('Escolha uma forma de pagamento.');
            return;
        }

        if (metodo === 'credito' || metodo === 'debito') {
            const num = document.getElementById('num-cartao')?.value.trim();
            const validade = document.getElementById('validade-cartao')?.value.trim();
            const cvv = document.getElementById('cvv-cartao')?.value.trim();

            if (!num || !validade || !cvv) {
                alert('Preencha todos os dados do cartão.');
                return;
            }

            if (num.replace(/\s/g, '').length !== 16) {
                alert('Número do cartão inválido.');
                return;
            }

            if (!/^\d{2}\/\d{2}$/.test(validade)) {
                alert('Validade inválida.');
                return;
            }

            if (!/^\d{3}$/.test(cvv)) {
                alert('CVV inválido.');
                return;
            }
        }

        mostrarModalConfirmacao();
    });

    function mostrarModalConfirmacao() {
        const nomeProduto = document.getElementById('nome-produto')?.textContent || '';
        const valorFinal = document.querySelector('.preco-final')?.textContent || '';

        document.getElementById('modal-produto').textContent = `Produto: ${nomeProduto}`;
        document.getElementById('modal-valor').textContent = `Valor pago: ${valorFinal}`;

        document.getElementById('modal-confirmacao').style.display = 'flex';
    }

    window.fecharModal = function () {
        document.getElementById('modal-confirmacao').style.display = 'none';
        localStorage.removeItem('carrinho');
        window.location.href = '../index.html';
    };
});

function renderizarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const container = document.getElementById('container-produtos') || document.createElement('div');
    container.id = 'container-produtos';

    const mainContainer = document.querySelector('.container');
    if (!mainContainer.contains(container)) mainContainer.prepend(container);

    container.innerHTML = '';

    const tituloCarrinho = document.createElement('h2');
    tituloCarrinho.textContent = 'MEU CARRINHO';
    tituloCarrinho.style.color = 'darkgreen';
    tituloCarrinho.style.textAlign = 'center';
    tituloCarrinho.style.marginBottom = '20px';
    container.appendChild(tituloCarrinho);

    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    carrinho.forEach((produto, index) => {
        if (!isMobile && (!produto.quantidade || produto.quantidade < 1)) {
            produto.quantidade = 1;
        }
        const precoTotal = produto.preco * (produto.quantidade ?? 1);
        const precoDesconto = precoTotal * 0.9;
        const caminhoImagem = produto.img.startsWith('http') ? produto.img : '../' + produto.img;

        const quantidadeClasse = (produto.quantidade === 0 && isMobile) ? 'quantidade-zero' : '';

        const carrinhoItem = document.createElement('div');
        carrinhoItem.classList.add('carrinho-container');
        carrinhoItem.innerHTML = `
            <div class="produto-card">
                <img src="${caminhoImagem}" alt="${produto.nome}">
                <div class="info-produto">
                    <strong id="nome-produto">${produto.nome}</strong>
                    <p class="estoque">🟢 Em estoque. Envio imediato.</p>
                </div>
            </div>

            <table class="tabela">
                <thead>
                    <tr>
                        <th>Preço</th>
                        <th>Quantidade</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Produto<br>R$ ${produto.preco.toFixed(2)}</td>
                        <td>
                            <div class="quantidade">
                                <button class="diminuir" data-index="${index}">-</button>
                                <input type="text" value="${produto.quantidade !== undefined ? produto.quantidade : 1}" readonly class="${quantidadeClasse}" data-index="${index}">
                                <button class="aumentar" data-index="${index}">+</button>
                            </div>
                        </td>
                        <td>
                            <s>R$ ${precoTotal.toFixed(2)}</s><br>
                            <span class="preco-final">R$ ${precoDesconto.toFixed(2)}</span>
                        </td>
                        <td id="remover">
                            <button class="btnRemover" data-index="${index}">Remover</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;

        container.appendChild(carrinhoItem);
    });

    container.querySelectorAll('.aumentar').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            carrinho[index].quantidade += 1;
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            renderizarCarrinho();
            atualizarTotalGeral();
        });
    });

    container.querySelectorAll('.diminuir').forEach(btn => {
    btn.addEventListener('click', () => {
        const index = btn.getAttribute('data-index');
        const isMobile = window.matchMedia('(max-width: 768px)').matches;

        if (isMobile) {
            carrinho[index].quantidade = Math.max(0, carrinho[index].quantidade - 1);
        } else {
            carrinho[index].quantidade = Math.max(1, carrinho[index].quantidade - 1);
        }

        // Adiciona a classe 'quantidade-zero' somente se for 0 e for mobile
        if (isMobile && carrinho[index].quantidade === 0) {
            const input = document.querySelector(`.quantidade input[data-index='${index}']`);
            if (input) input.classList.add('quantidade-zero');
        }

        // Sempre atualiza o localStorage e re-renderiza
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        renderizarCarrinho();
        atualizarTotalGeral();
    });
});


    container.querySelectorAll('.btnRemover').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            carrinho.splice(index, 1);
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            renderizarCarrinho();
            atualizarTotalGeral();
        });
    });

    atualizarTotalGeral();
}

function atualizarTotalGeral() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let soma = 0;

    carrinho.forEach(produto => {
        const precoTotal = produto.preco * (produto.quantidade ?? 1);
        const precoDesconto = precoTotal * 0.9;
        soma += precoDesconto;
    });

    const totalGeralElem = document.getElementById('total-geral');
    if (totalGeralElem) {
        const valorFormatado = soma.toFixed(2).replace('.', ',');
        totalGeralElem.innerHTML = `Total do carrinho: R$ ${valorFormatado}`;
    }
}


async function gerarBoletoPDF() {
    const { jsPDF } = window.jspdf;

    const nome = document.getElementById('nome-produto')?.textContent || "Produto";
    const valor = document.querySelector('.preco-final')?.textContent.replace('R$', '').trim();

    const vencimento = new Date();
    vencimento.setDate(vencimento.getDate() + 3);
    const vencFormatado = vencimento.toLocaleDateString('pt-BR');

    const linhaDigitavel = gerarLinhaDigitavel();

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Boleto Bancário (Fictício)', 20, 20);

    doc.setFontSize(12);
    doc.text(`Beneficiário: NutriVision LTDA`, 20, 40);
    doc.text(`Pagador: Cliente - ${nome}`, 20, 50);
    doc.text(`Vencimento: ${vencFormatado}`, 20, 60);
    doc.text(`Valor: R$ ${valor}`, 20, 70);
    doc.text(`Linha Digitável: ${linhaDigitavel}`, 20, 80);

    doc.setFontSize(10);
    doc.text('Este boleto é apenas ilustrativo e não possui valor legal.', 20, 100);

    doc.save(`boleto-${nome.replace(/\s/g, '_')}.pdf`);
}

function gerarLinhaDigitavel() {
    let linha = '';
    for (let i = 0; i < 47; i++) {
        linha += Math.floor(Math.random() * 10);
        if ((i + 1) % 5 === 0) linha += ' ';
    }
    return linha.trim();
}
