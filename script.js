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

    showStep(currentStep);
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', maskPhoneNumber);
    }

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
});

let currentStep = 1;
const totalSteps = document.querySelectorAll('.step').length;

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

    if (cardNumber && cardNumber.value.trim() === '') {
        displayMessage(cardNumber, 'Por favor, insira o número do cartão.');
        cardNumber.focus();
        isValid = false;
    } else if (cardName && cardName.value.trim() === '') {
        displayMessage(cardName, 'Por favor, insira o nome impresso no cartão.');
        cardName.focus();
        isValid = false;
    } else if (cardExpiry) {
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
    } else if (cardCVV && !/^[0-9]{3,4}$/.test(cardCVV.value.trim())) {
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
            } else if (cep && (cep.value.trim() === '' || !/^\d{5}-?\d{3}$/.test(cep.value.trim()))) {
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
            isValid = validateCreditCardDetails(currentActiveStep);

            if (isValid) {
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
    const endereco = document.getElementById('endereco').value;
    const numero = document.getElementById('numero').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;
    const cep = document.getElementById('cep').value;

    const numeroCartaoInput = document.getElementById('numeroCartao');
    const parcelasSelect = document.getElementById('parcelas');

    const cardNumber = numeroCartaoInput ? numeroCartaoInput.value : '';
    const parcelasText = parcelasSelect ? parcelasSelect.options[parcelasSelect.selectedIndex].text : '';

    document.getElementById('confirm-name').textContent = nome;
    document.getElementById('confirm-email').textContent = email;
    document.getElementById('confirm-phone').textContent = telefone;
    document.getElementById('confirm-address').textContent = `${endereco}, ${numero} - ${cidade}/${estado}, ${cep}`;
    document.getElementById('confirm-card').textContent = `**** **** **** ${cardNumber.slice(-4)}`;
    document.getElementById('confirm-installments').textContent = parcelasText;
}


function completeSubscription() {
    if (validateStep(currentStep)) {
        alert('Assinatura concluída com sucesso!');
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

// A máscara de CEP continua no 'input' para formatar enquanto digita
// Mas a consulta ao ViaCEP será no 'blur'
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

async function lookupCEP(cepValue) {
    const enderecoInput = document.getElementById('endereco');
    const cidadeInput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');
    const cepInput = document.getElementById('cep');

    if (!cepInput || !enderecoInput || !cidadeInput || !estadoInput) return;

    displayMessage(cepInput, ''); // Limpa qualquer mensagem de erro anterior

    // Desativa campos temporariamente
    enderecoInput.readOnly = true;
    cidadeInput.readOnly = true;
    estadoInput.readOnly = true;

    // Limpa os campos enquanto a busca está em andamento
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
        // Reativa os campos
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
