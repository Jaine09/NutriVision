document.addEventListener('DOMContentLoaded', () => {
    const nextButtons = document.querySelectorAll('.next');
    const prevButtons = document.querySelectorAll('.prev');
    const completeButton = document.getElementById('complete-subscription');

    nextButtons.forEach(button => {
        button.addEventListener('click', nextStep);
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', prevStep);
    });

    if (completeButton) {
        completeButton.addEventListener('click', completeSubscription);
    }

    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', maskPhoneNumber);
    }

    const cpfInput = document.getElementById('cpf');
    if (cpfInput) maskCPF(cpfInput);

    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', maskCEP);

        cepInput.addEventListener('blur', (event) => {
            const cepValue = event.target.value.replace(/\D/g, '');
            if (cepValue.length === 8) {
                lookupCEP(cepValue);
            } else if (cepValue.length > 0 && cepValue.length < 8) {
                displayMessage(event.target, 'CEP incompleto. Digite 8 dígitos.');
            } else {
                displayMessage(event.target, '');
            }
        });
    }

    const cardNumberInput = document.getElementById('numeroCartao');

    const cardExpiryInput = document.getElementById('dataValidade');
    const cardCVVInput = document.getElementById('cvv');

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', maskCardNumber);
    }

    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', maskCardExpiry);
    }

    if (cardCVVInput) {
        cardCVVInput.addEventListener('input', maskCVV);
    }

    showStep(currentStep);
});

let currentStep = 1;
const totalSteps = document.querySelectorAll('.step').length;
console.log("Total de steps:", totalSteps);

function displayMessage(inputElement, message) {
    const messageSpan = inputElement.nextElementSibling;
    if (messageSpan && messageSpan.classList.contains('mensagem')) {
        messageSpan.textContent = message;
        if (message) {
            messageSpan.classList.add('ativo');
            inputElement.classList.add('invalid');
        } else {
            messageSpan.classList.remove('ativo');
            inputElement.classList.remove('invalid');
        }
    }
}

function clearStepMessages(stepElement) {
    const messages = stepElement.querySelectorAll('.mensagem');
    messages.forEach(span => {
        span.textContent = '';
        span.classList.remove('ativo');
    });
    const invalidInputs = stepElement.querySelectorAll('.invalid');
    invalidInputs.forEach(input => input.classList.remove('invalid'));
}

function showStep(stepNumber) {
    console.log("Mostrando step:", stepNumber);
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.classList.remove('active');
        clearStepMessages(step);
    });
    document.querySelector(`.step[data-step="${stepNumber}"]`).classList.add('active');

    const progressFill = document.querySelector('.progress-fill');
    const percentage = ((stepNumber - 1) / (totalSteps - 1)) * 100;
    progressFill.style.width = `${percentage}%`;

    if (stepNumber === 4) {
        updateConfirmationDetails();
    }
}

function validateCreditCardDetails(stepElement) {
    let isValid = true;

    const cardNumber = stepElement.querySelector('#numeroCartao');
    const cardName = stepElement.querySelector('#nomeCartao');
    const cardExpiry = stepElement.querySelector('#dataValidade');
    const cardCVV = stepElement.querySelector('#cvv');

    displayMessage(cardNumber, '');
    displayMessage(cardName, '');
    displayMessage(cardExpiry, '');
    displayMessage(cardCVV, '');

    if (cardNumber) {
        const rawCardNumber = cardNumber.value.replace(/\s/g, '');

        if (rawCardNumber.trim() === '') {
            displayMessage(cardNumber, 'Por favor, insira o número do cartão.');
            cardNumber.focus();
            isValid = false;
        } else if (rawCardNumber.length < 13 || rawCardNumber.length > 16) {
            displayMessage(cardNumber, 'Número de cartão inválido.');
            cardNumber.focus();
            isValid = false;
        }
    }

    if (cardName && cardName.value.trim() === '') {
        displayMessage(cardName, 'Por favor, insira o nome impresso no cartão.');
        cardName.focus();
        isValid = false;
    }

    if (cardExpiry) {
        const expiryValue = cardExpiry.value.trim();
        const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;

        if (!expiryRegex.test(expiryValue)) {
            displayMessage(cardExpiry, 'Formato inválido (MM/AA).');
            cardExpiry.focus();
            isValid = false;
        } else {
            const [month, year] = expiryValue.split('/').map(Number);
            const currentYear = new Date().getFullYear() % 100;
            const currentMonth = new Date().getMonth() + 1;

            if (year < currentYear || (year === currentYear && month < currentMonth)) {
                displayMessage(cardExpiry, 'Data de validade não pode ser no passado.');
                cardExpiry.focus();
                isValid = false;
            }
        }
    }

    if (cardCVV && !/^[0-9]{3,4}$/.test(cardCVV.value.trim())) {
        displayMessage(cardCVV, 'CVV inválido (3 ou 4 dígitos).');
        cardCVV.focus();
        isValid = false;
    }


    return isValid;
}

function validateStep(stepNumber) {
    let isValid = true;
    const currentActiveStep = document.querySelector(`.step[data-step="${stepNumber}"]`);

    clearStepMessages(currentActiveStep);

    switch (stepNumber) {
        case 1:
            const nomeCompleto = document.getElementById('nomeCompleto');
            const email = document.getElementById('email');
            const telefone = document.getElementById('telefone');
            const cpfInput = document.getElementById('cpf');
            const cep = document.getElementById('cep');
            const endereco = document.getElementById('endereco');
            const cidade = document.getElementById('cidade');
            const estado = document.getElementById('estado');
            const numero = document.getElementById('numero');

            if (nomeCompleto && nomeCompleto.value.trim() === '') {
                displayMessage(nomeCompleto, 'Preencha seu nome completo.');
                nomeCompleto.focus();
                isValid = false;
            } else if (email && (email.value.trim() === '' || !email.value.includes('@') || !email.value.includes('.'))) {
                displayMessage(email, 'Insira um e-mail válido.');
                email.focus();
                isValid = false;
            } else if (telefone && (telefone.value.trim() === '' || telefone.value.replace(/\D/g, '').length < 10)) {
                displayMessage(telefone, 'Insira um telefone válido (DDD + 8 ou 9 dígitos).');
                telefone.focus();
                isValid = false;
            } else
                if (cpf.value.trim().length < 14) {
                    displayMessage(cpfInput, 'CPF inválido ou incompleto');
                    cpfInput.focus();
                    isValid = false;
                }
                else if (cep && (cep.value.trim() === '' || !/^\d{5}-?\d{3}$/.test(cep.value.trim()))) {
                    displayMessage(cep, 'Insira um CEP válido (Ex: 12345-678).');
                    cep.focus();
                    isValid = false;
                } else if (endereco && endereco.value.trim() === '') {
                    displayMessage(endereco, 'Preencha seu endereço.');
                    endereco.focus();
                    isValid = false;
                } else if (cidade && cidade.value.trim() === '') {
                    displayMessage(cidade, 'Preencha sua cidade.');
                    cidade.focus();
                    isValid = false;
                } else if (estado && (estado.value.trim() === '' || estado.value.trim().length !== 2 || !/^[a-zA-Z]{2}$/.test(estado.value.trim()))) {
                    displayMessage(estado, 'Insira um estado válido (UF com 2 letras).');
                    estado.focus();
                    isValid = false;
                }
            break;
        case 2:
            break;
        case 3:
            const tipoPagamento = document.getElementById('tipoPagamento');
            const tipoMsg = tipoPagamento.nextElementSibling;

            if (!tipoPagamento.value) {
                if (tipoMsg) {
                    tipoMsg.textContent = 'Selecione o tipo de pagamento.';
                    tipoMsg.classList.add('ativo');
                }
                tipoPagamento.focus();
                return false;
            } else {
                if (tipoMsg && tipoMsg.classList.contains('mensagem')) {
                    if (tipoMsg) {
                        tipoMsg.textContent = '';
                        tipoMsg.classList.remove('ativo');
                    }

                }
            }

            if (tipoPagamento.value === 'credito' || tipoPagamento.value === 'debito') {
                isValid = validateCreditCardDetails(currentActiveStep);
            }

            if (tipoPagamento.value === 'credito' && isValid) {
                const parcelasSelect = document.getElementById('parcelas');
                const parcelasMessageSpan = parcelasSelect.closest('.select-wrapper').nextElementSibling;

                if (parcelasSelect && parcelasSelect.value === '') {
                    if (parcelasMessageSpan && parcelasMessageSpan.classList.contains('mensagem')) {
                        parcelasMessageSpan.textContent = 'Por favor, selecione o número de parcelas.';
                        parcelasMessageSpan.classList.add('ativo');
                    }
                    parcelasSelect.focus();
                    isValid = false;
                } else {
                    if (parcelasMessageSpan && parcelasMessageSpan.classList.contains('mensagem')) {
                        parcelasMessageSpan.textContent = '';
                        parcelasMessageSpan.classList.remove('ativo');
                    }
                }
            }
            break;

        case 4:
            updateConfirmationDetails();
            break;
    }
    return isValid;
}

function nextStep() {
    if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function updateConfirmationDetails() {
    const nome = document.getElementById('nomeCompleto').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const cpf = document.getElementById('cpf').value;
    const endereco = document.getElementById('endereco').value;
    const numero = document.getElementById('numero').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;
    const cep = document.getElementById('cep').value;

    const tipoPagamento = document.getElementById('tipoPagamento').value;
    const parcelasSelect = document.getElementById('parcelas');
    const numeroCartao = document.getElementById('numeroCartao').value.replace(/\s/g, '');

    // Dados pessoais
    document.getElementById('confirm-name').textContent = nome;
    document.getElementById('confirm-email').textContent = email;
    document.getElementById('confirm-phone').textContent = telefone;
    document.getElementById('confirm-cpf').textContent = cpf;
    document.getElementById('confirm-address').textContent = `${endereco}, ${numero} - ${cidade}/${estado}, ${cep}`;

    // Tipo de pagamento
    let tipoLabel = '';
    switch (tipoPagamento) {
        case 'credito':
            tipoLabel = 'Cartão de Crédito';
            break;
        case 'pix':
            tipoLabel = 'PIX (3% de desconto)';
            break;
        case 'boleto':
            tipoLabel = 'Boleto Bancário';
            break;
        case 'debito':
            tipoLabel = 'Cartão de Débito';
            break;
        default:
            tipoLabel = 'Não informado';
    }

    document.getElementById('confirm-payment-type').textContent = tipoLabel;

    // Parcelas ou valor final
    let valor = '';
    if (tipoPagamento === 'credito') {
        valor = parcelasSelect.options[parcelasSelect.selectedIndex]?.text || '';
        document.getElementById('confirm-card').textContent = `**** **** **** ${numeroCartao.slice(-4)}`;
    } else if (tipoPagamento === 'pix') {
        valor = 'R$ 474,99 (com 3% de desconto)';
        document.getElementById('confirm-card').textContent = '-';
    } else if (tipoPagamento === 'boleto') {
        valor = 'R$ 499,99';
        document.getElementById('confirm-card').textContent = '-';
    } else if (tipoPagamento === 'debito') {
        valor = 'R$ 499,99 à vista';
        document.getElementById('confirm-card').textContent = `**** **** **** ${numeroCartao.slice(-4)}`;
    } else {
        valor = '-';
        document.getElementById('confirm-card').textContent = '-';
    }

    document.getElementById('confirm-installments').textContent = valor;

    const qrcodeContainer = document.getElementById('pix-area');
    const boletoContainer = document.getElementById('boleto-area');

    if (qrcodeContainer) qrcodeContainer.style.display = tipoPagamento === 'pix' ? 'block' : 'none';
    if (boletoContainer) boletoContainer.style.display = tipoPagamento === 'boleto' ? 'block' : 'none';

    const dadosAssinatura = {
        nome,
        email,
        telefone,
        cpf,
        endereco,
        numero,
        cidade,
        estado,
        cep,
        tipoPagamento,
        numeroCartao: numeroCartao.slice(-4),
        parcelas: valor
    };
    localStorage.setItem('assinaturaDados', JSON.stringify(dadosAssinatura));
}

function completeSubscription() {
    if (validateStep(currentStep)) {
        mostrarModalSucesso();
    }
}

function maskPhoneNumber(event) {
    let input = event.target;
    let value = input.value.replace(/\D/g, '');
    let formattedValue = '';

    if (value.length > 0) {
        formattedValue += '(' + value.substring(0, 2);
    }
    if (value.length > 2) {
        formattedValue += ') ' + value.substring(2, 7);
    }
    if (value.length > 7) {
        formattedValue += '-' + value.substring(7, 11);
    }
    input.value = formattedValue;
}

function maskCEP(event) {
    let input = event.target;
    let value = input.value.replace(/\D/g, '');
    let formattedValue = '';

    if (value.length > 5) {
        formattedValue = value.substring(0, 5) + '-' + value.substring(5, 8);
    } else {
        formattedValue = value;
    }
    input.value = formattedValue;
}

function maskCardNumber(event) {
    let input = event.target;
    let value = input.value.replace(/\D/g, '').substring(0, 16);
    let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
    input.value = formattedValue;
}

function maskCPF(input) {
    input.addEventListener('input', () => {
        let valor = input.value.replace(/\D/g, '');

        if (valor.length > 11) valor = valor.slice(0, 11);

        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        input.value = valor;
    });
}

async function lookupCEP(cepValue) {
    const enderecoInput = document.getElementById('endereco');
    const cidadeInput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');
    const cepInput = document.getElementById('cep');

    if (!cepInput || !enderecoInput || !cidadeInput || !estadoInput) return;

    displayMessage(cepInput, '');

    enderecoInput.readOnly = true;
    cidadeInput.readOnly = true;
    estadoInput.readOnly = true;

    clearAddressFields();

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
        const data = await response.json();

        if (data.erro) {
            displayMessage(cepInput, 'CEP não encontrado.');
        } else {
            enderecoInput.value = data.logradouro || '';
            cidadeInput.value = data.localidade || '';
            estadoInput.value = data.uf || '';
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        displayMessage(cepInput, 'Erro ao buscar CEP. Tente novamente.');
    } finally {
        enderecoInput.readOnly = false;
        cidadeInput.readOnly = false;
        estadoInput.readOnly = false;
    }
}

function clearAddressFields() {
    document.getElementById('endereco').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('estado').value = '';
    document.getElementById('numero').value = '';
}

function maskCardExpiry(event) {
    let input = event.target;
    let value = input.value.replace(/\D/g, '').substring(0, 4);

    if (value.length >= 2) {
        let month = parseInt(value.substring(0, 2), 10);

        // Corrige mês inválido
        if (month < 1) {
            month = '01';
        } else if (month > 12) {
            month = '12';
        } else {
            month = value.substring(0, 2);
        }

        let year = value.substring(2);
        input.value = year ? `${month}/${year}` : `${month}`;
    } else {
        input.value = value;
    }

    if (value.length === 4) {
        moveToNextInput(input);
    }
}

function maskCVV(event) {
    let input = event.target;
    let value = input.value.replace(/\D/g, '').substring(0, 4);
    input.value = value;

    if (value.length >= 3) {
        moveToNextInput(input);
    }
}

function moveToNextInput(input) {
    const formElements = Array.from(document.querySelectorAll('input, select, textarea, button'));
    const index = formElements.indexOf(input);
    if (index > -1 && index < formElements.length - 1) {
        const next = formElements[index + 1];
        if (!next.disabled && !next.readOnly) {
            next.focus();
        }
    }
}

function toggleParcelas() {
    const tipo = document.getElementById('tipoPagamento').value;
    const parcelasWrapper = document.getElementById('parcelas-wrapper');
    const camposCartao = ['numeroCartao', 'nomeCartao', 'dataValidade', 'cvv'];

    // Mostrar/ocultar parcelas
    parcelasWrapper.style.display = tipo === 'credito' ? 'block' : 'none';

    // Mostrar ou ocultar campos de cartão
    camposCartao.forEach(id => {
        const campo = document.getElementById(id);
        campo.parentElement.style.display = (tipo === 'credito' || tipo === 'debito') ? 'block' : 'none';
    });
}

function editInfo() {
    currentStep = 1;
    showStep(currentStep);
}

// Inicialização visual dos campos com base no tipo de pagamento
function inicializarVisibilidadeCamposPagamento() {
    const tipoPagamento = document.getElementById('tipoPagamento');
    if (tipoPagamento) {
        tipoPagamento.addEventListener('change', atualizarTipoPagamento);
        atualizarTipoPagamento(); // já aplicar no carregamento inicial
    }
}

function atualizarTipoPagamento() {
    const tipo = document.getElementById('tipoPagamento').value;
    const parcelasContainer = document.getElementById('parcelas-container');
    const camposCartaoIds = ['numeroCartao', 'nomeCartao', 'dataValidade', 'cvv'];

    // Mostrar parcelas somente para cartão crédito
    parcelasContainer.style.display = tipo === 'credito' ? 'block' : 'none';

    // Mostrar campos do cartão para crédito ou débito, ocultar caso contrário
    camposCartaoIds.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.parentElement.style.display = (tipo === 'credito' || tipo === 'debito') ? 'block' : 'none';
        }
    });

    // Sempre que mudar o tipo de pagamento, atualiza a confirmação para refletir as mudanças
    updateConfirmationDetails();
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarVisibilidadeCamposPagamento();
});

function goToStep(stepNumber) {
    currentStep = stepNumber;
    showStep(currentStep);
}

function mostrarModalSucesso() {
    const modal = document.getElementById('modal-sucesso');
    modal.style.display = 'block';

    // Após 4 segundos, redireciona para outra página
    setTimeout(() => {
        window.location.href = 'pagina_usuario.html';
    }, 4000);
}

