let contatoAtual = null;
let etapaAtual = 0;

// Adiciona mensagem ao chat
function adicionarMensagem(texto, tipo) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `mensagem ${tipo}`;
  msgDiv.textContent = texto;
  document.getElementById("chat-mensagens").appendChild(msgDiv);
  msgDiv.scrollIntoView({ behavior: "smooth" });

  // Salva a mensagem
  salvarMensagem(contatoAtual, { texto, tipo });
}

// Salva a mensagem no localStorage
function salvarMensagem(contato, mensagem) {
  if (!contato) return;
  let historico = JSON.parse(localStorage.getItem(`chat-${contato}`)) || [];
  historico.push(mensagem);
  localStorage.setItem(`chat-${contato}`, JSON.stringify(historico));
}

// Abre o chat do contato selecionado
function abrirChat(contato) {
  contatoAtual = contato;
  etapaAtual = 0;

  const titulos = {
    nutri: "Chat com Nutricionista",
    personal: "Chat com Personal Trainer",
    psicologa: "Chat com Psicóloga"
  };

  document.getElementById("chat-titulo").textContent = titulos[contato];
  const chatBox = document.getElementById("chat-mensagens");
  chatBox.innerHTML = "";

  let historico = JSON.parse(localStorage.getItem(`chat-${contato}`)) || [];

  // Renderiza o histórico no chat
  historico.forEach(msg => {
    adicionarMensagem(msg.texto, msg.tipo);
  });

  etapaAtual = historico.filter(msg => msg.tipo === "bot").length;
}


async function enviarMensagem() {
  const input = document.getElementById("input-mensagem");
  const texto = input.value.trim();
  if (!texto || !contatoAtual) return;

  adicionarMensagem(texto, "user");
  input.value = "";

  // Verifica se é a primeira mensagem para esse contato
  let historico = JSON.parse(localStorage.getItem(`chat-${contatoAtual}`)) || [];
  const temBoasVindas = historico.some(msg => msg.texto.includes("é um prazer ter você aqui"));

  // Se não tem boas-vindas ainda, envia primeiro essa mensagem
  if (!temBoasVindas) {
    const boasVindas = "Olá, é um prazer ter você aqui. Espere só um momento que o profissional irá lhe atender.";
    adicionarMensagem(boasVindas, "bot");
    salvarMensagem(contatoAtual, { texto: boasVindas, tipo: "bot" });

    // Aguarda um momento antes de continuar
    setTimeout(async () => {
      const resposta = await chamarChatSimulado(texto, contatoAtual);
      adicionarMensagem(resposta, "bot");
      salvarMensagem(contatoAtual, { texto: resposta, tipo: "bot" });
    }, 2000);
  } else {
    const resposta = await chamarChatSimulado(texto, contatoAtual);
    adicionarMensagem(resposta, "bot");
    salvarMensagem(contatoAtual, { texto: resposta, tipo: "bot" });
  }

  salvarMensagem(contatoAtual, { texto, tipo: "user" });
}

let aguardandoConfirmacao = null; // para controlar confirmação de dica/link

function responderMensagem(contato, texto) {
  texto = texto.toLowerCase();

  if (aguardandoConfirmacao) {
    // Usuário respondeu à pergunta que precisa confirmação (sim/não)
    if (texto.includes("sim")) {
      // Resposta positiva: envio dica + link conforme tema aguardado e perfil
      return enviarDicaLink(contato, aguardandoConfirmacao);
    } else {
      aguardandoConfirmacao = null;
      return "Tudo bem, sem problemas. Posso ajudar em algo mais?";
    }
  }

  // Fluxos normais por contato
  switch (contato) {
    case "nutri":
      return responderNutri(texto);
    case "personal":
      return responderPersonal(texto);
    case "psicologa":
      return responderPsicologa(texto);
    default:
      return "Selecione um contato para iniciar a conversa.";
  }
}

function enviarDicaLink(contato, tema) {
  let resposta = "";
  aguardandoConfirmacao = null;

  if (contato === "nutri") {
    switch (tema) {
      case "emagrecer":
        resposta = "Ótimo! Aqui vai uma dica: Evite alimentos ultraprocessados e mantenha um déficit calórico moderado.\n" +
                  "Veja mais em: https://www.saude.gov.br/saude-de-a-z/emagrecimento";
        break;
      case "dieta":
        resposta = "Perfeito! Priorize alimentos frescos e varie as cores no prato para garantir nutrientes.\n" +
                  "Mais informações: https://www.minhavida.com.br/alimentacao/tudo-sobre/45263-dieta-equilibrada";
        break;
      case "cardapio":
        resposta = "Legal! Comer de 3 em 3 horas ajuda a manter o metabolismo ativo.\n" +
                  "Confira sugestões em: https://www.tuasaude.com/cardapio-semanal-saudavel/";
        break;
      case "receitas":
        resposta = "Ótima escolha! Use temperos naturais como ervas e especiarias para dar sabor sem excesso de sódio.\n" +
                  "Veja receitas aqui: https://www.panelinha.com.br/receita/Receitas-saudaveis";
        break;
      case "exercicios":
        resposta = "Excelente! Sempre faça alongamento antes e depois dos exercícios.\n" +
                  "Dicas em: https://www.cbf.com.br/a-cbf/exercicios-para-emagrecer";
        break;
      default:
        resposta = "Aqui está uma dica útil para você!";
    }
  } else if (contato === "personal") {
    switch (tema) {
      case "treino":
        resposta = "Ótimo! Para treinos eficazes, mantenha uma rotina variada com exercícios de força e cardio.\n" +
                  "Confira dicas: https://www.tuasaude.com/exercicios-fisicos/";
        break;
      case "musculação":
        resposta = "Perfeito! A musculação deve ser feita com carga progressiva para melhores resultados.\n" +
                  "Saiba mais: https://www.muscleandfitness.com.br/musculacao/";
        break;
      case "alongamento":
        resposta = "Alongamento é essencial para prevenir lesões e melhorar a flexibilidade.\n" +
                  "Veja técnicas aqui: https://www.minhavida.com.br/fitness/materias/16668-alongamento-beneficios";
        break;
      case "descanso":
        resposta = "O descanso é tão importante quanto o treino para a recuperação muscular.\n" +
                  "Mais informações: https://www.tuasaude.com/descanso-apos-treino/";
        break;
      default:
        resposta = "Aqui está uma dica para melhorar seu treino!";
    }
  } else if (contato === "psicologa") {
    switch (tema) {
      case "ansiedade":
        resposta = "Ótimo! Técnicas de respiração e mindfulness ajudam a controlar a ansiedade.\n" +
                  "Confira aqui: https://www.minhavida.com.br/saude/temas/ansiedade";
        break;
      case "depressao":
        resposta = "Perfeito! Terapia e exercícios físicos são aliados no tratamento da depressão.\n" +
                  "Saiba mais: https://www.saude.gov.br/saude-de-a-z/depressao";
        break;
      case "estresse":
        resposta = "Controlar o estresse envolve gestão do tempo e momentos de lazer.\n" +
                  "Veja dicas: https://www.tuasaude.com/estresse/";
        break;
      case "sono":
        resposta = "Ter uma boa qualidade de sono é fundamental para a saúde mental.\n" +
                  "Mais detalhes: https://www.minhavida.com.br/saude/temas/sono";
        break;
      default:
        resposta = "Aqui está uma dica que pode ajudar você!";
    }
  }

  return resposta + "\n\nPosso ajudar em algo mais?";
}

function responderNutri(texto) {
  let resposta = "";
  if (texto.includes("emagrecer")) {
    resposta = "Para emagrecer com saúde, foque em alimentos naturais e mantenha uma rotina equilibrada. Quer dicas? (sim/não)";
    aguardandoConfirmacao = "emagrecer";
  } else if (texto.includes("dieta") || texto.includes("alimentação")) {
    resposta = "Uma boa dieta inclui equilíbrio entre vegetais, proteínas e carboidratos complexos. Quer um exemplo de cardápio diário? (sim/não)";
    aguardandoConfirmacao = "dieta";
  } else if (texto.includes("cardápio")) {
    resposta = "Claro! Posso sugerir um cardápio saudável. Quer? (sim/não)";
    aguardandoConfirmacao = "cardapio";
  } else if (texto.includes("receitas")) {
    resposta = "Quer receitas saudáveis e rápidas? (sim/não)";
    aguardandoConfirmacao = "receitas";
  } else if (texto.includes("exercícios") || texto.includes("exercicios")) {
    resposta = "Exercícios ajudam muito no emagrecimento. Quer dicas de como combinar com alimentação? (sim/não)";
    aguardandoConfirmacao = "exercicios";
  } else if (texto.includes("obrigado") || texto.includes("valeu") || texto.includes("obrigada")) {
    resposta = "De nada! Sempre que precisar, estarei aqui para ajudar. Cuide bem da sua saúde!";
  } else {
    resposta = "Olá! Sou a Dra. Mayara, nutricionista. Como posso te ajudar hoje?";
  }
  return resposta;
}

function responderPersonal(texto) {
  let resposta = "";
  if (texto.includes("treino") || texto.includes("exercício") || texto.includes("exercicio")) {
    resposta = "Para um treino eficaz, é importante variar exercícios de força e cardio. Quer dicas? (sim/não)";
    aguardandoConfirmacao = "treino";
  } else if (texto.includes("musculação")) {
    resposta = "A musculação deve ser feita com carga progressiva para melhores resultados. Quer saber mais? (sim/não)";
    aguardandoConfirmacao = "musculação";
  } else if (texto.includes("alongamento")) {
    resposta = "Alongamento previne lesões e melhora flexibilidade. Quer dicas? (sim/não)";
    aguardandoConfirmacao = "alongamento";
  } else if (texto.includes("descanso")) {
    resposta = "O descanso é essencial para recuperação muscular. Quer dicas? (sim/não)";
    aguardandoConfirmacao = "descanso";
  } else if (texto.includes("obrigado") || texto.includes("valeu") || texto.includes("obrigada")) {
    resposta = "De nada! Continue firme no treino!";
  } else {
    resposta = "Olá! Sou o seu Personal Trainer. Como posso ajudar no seu treino hoje?";
  }
  return resposta;
}

function responderPsicologa(texto) {
  let resposta = "";
  if (texto.includes("ansiedade")) {
    resposta = "Técnicas de respiração e mindfulness ajudam a controlar a ansiedade. Quer dicas? (sim/não)";
    aguardandoConfirmacao = "ansiedade";
  } else if (texto.includes("depressão") || texto.includes("depressao")) {
    resposta = "Terapia e exercícios físicos são aliados no tratamento da depressão. Quer saber mais? (sim/não)";
    aguardandoConfirmacao = "depressao";
  } else if (texto.includes("estresse")) {
    resposta = "Gestão do tempo e lazer ajudam a controlar o estresse. Quer dicas? (sim/não)";
    aguardandoConfirmacao = "estresse";
  } else if (texto.includes("sono")) {
    resposta = "Ter uma boa qualidade de sono é fundamental para saúde mental. Quer saber mais? (sim/não)";
    aguardandoConfirmacao = "sono";
  } else if (texto.includes("obrigado") || texto.includes("valeu") || texto.includes("obrigada")) {
    resposta = "De nada! Estou aqui para apoiar você sempre que precisar.";
  } else {
    resposta = "Olá! Sou a psicóloga aqui para ajudar. Sobre o que gostaria de conversar hoje?";
  }
  return resposta;
}

async function chamarChatSimulado(pergunta, contato) {
  return responderMensagem(contato, pergunta);
}

// Permitir Enter para enviar
document.getElementById("input-mensagem").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    enviarMensagem();
  }
});
