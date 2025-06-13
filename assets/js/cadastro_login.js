document.addEventListener('DOMContentLoaded', () => {
    const cpfInput = document.getElementById('cpfCadastro');
    if (cpfInput) maskCPF(cpfInput);

    const form = document.getElementById('cadastrar-form');
    if (form) form.addEventListener('submit', realizarAssinatura);
});

function realizarAssinatura(event) {
    event.preventDefault();

    const nomeCadastro = document.getElementById('nomeCadastro').value.trim();
    const emailCadastro = document.getElementById('emailCadastro').value.trim();
    const cpfCadastro = document.getElementById('cpfCadastro').value.trim();
    const senhaCadastro = document.getElementById('senhaCadastro').value.trim();
    const mensagemCadastro = document.getElementById('mensagemErro');
    mensagemCadastro.textContent = '';

    if (!nomeCadastro || !emailCadastro || !cpfCadastro || !senhaCadastro) {
        mensagemCadastro.textContent = 'Por favor, preencha todos os campos.';
        mensagemCadastro.style.color = 'red';
        return;
    }

    if (!emailCadastro.includes('@')) {
        mensagemCadastro.textContent = 'Por favor, insira um e-mail válido.';
        mensagemCadastro.style.color = 'red';
        return;
    }

    if (senhaCadastro.length < 6 || senhaCadastro.length > 20) {
        mensagemCadastro.textContent = 'A senha deve ter entre 6 e 20 caracteres.';
        mensagemCadastro.style.color = 'red';
        return;
    }

    // Verifica se já existe esse usuário
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const cpfExiste = usuarios.some(u => u.cpf === cpfCadastro);
    const emailExiste = usuarios.some(u => u.email === emailCadastro);

    if (cpfExiste) {
        mensagemCadastro.textContent = 'CPF já cadastrado.';
        mensagemCadastro.style.color = 'red';
        return;
    }

    if (emailExiste) {
        mensagemCadastro.textContent = 'E-mail já cadastrado.';
        mensagemCadastro.style.color = 'red';
        return;
    }

    // Salvar novo usuário
    const novoUsuario = {
        nome: nomeCadastro,
        email: emailCadastro,
        cpf: cpfCadastro,
        senha: senhaCadastro
    };

    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    window.location.href = 'assinatura.html';
}

function realizarLogin(event) {
    event.preventDefault();

    const emailLogin = document.getElementById('emailLogin').value.trim();
    const senhaLogin = document.getElementById('senhaLogin').value.trim();
    const mensagemLogin = document.getElementById('mensagemErroLogin');
    mensagemLogin.textContent = '';

    if (!emailLogin || !senhaLogin) {
        mensagemLogin.textContent = 'Por favor, preencha todos os campos.';
        mensagemLogin.style.color = 'red';
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const usuarioEncontrado = usuarios.find(u => u.email === emailLogin && u.senha === senhaLogin);

    if (usuarioEncontrado) {
        // Salvar sessão simples
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
        window.location.href = 'pagina_usuario.html';
    } else {
        mensagemLogin.textContent = 'E-mail ou senha incorretos.';
        mensagemLogin.style.color = 'red';
    }
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
