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
        resposta = "Entendido! Uma dica importante: mantenha um déficit calórico leve e evite ultraprocessados.\n" +
                   "Dá uma olhadinha aqui:\n https://www.smartfit.com.br/news/nutricao/dicas-de-uma-nutricionista-para-emagrecer-de-vez/";
        break;
      case "dieta":
        resposta = "Uma alimentação equilibrada é a base de tudo! Priorize variedade e alimentos naturais.\n" +
                   "Mais detalhes:\n https://www.tuasaude.com/dieta-para-emagrecer/";
        break;
      case "cardapio":
        resposta = "Legal! Um cardápio saudável pode te dar mais energia e disposição ao longo do dia.\n" +
                   "Veja algumas ideias:\n https://www.lowcucar.com.br/cardapio-para-alimentacao-saudavel-monte-o-seu?srsltid=AfmBOoqJH2PwAPQ3WDC1iBcURmohl8LnTa07XFo4_2PflLNb--dPhXRF";
        break;
      case "receitas":
        resposta = "Receitas práticas e saudáveis podem transformar a sua rotina.\n" +
                   "Aqui tem várias opções:\n https://www.tudogostoso.com.br/noticias/receitas-fitness-a5188.html";
        break;
      case "exercicios":
        resposta = "Atividade física e alimentação andam de mãos dadas! Comece com caminhadas e vá evoluindo.\n" +
                   "Confira algumas sugestões:\n https://drpauloklein.com.br/blog/a-importancia-da-alimentacao-saudavel-e-atividade-fisica";
        break;
      case "hidratação":
        resposta = "Beber água com regularidade ajuda até no processo de emagrecimento!\n" +
                   "Veja mais sobre isso:\n https://www.tuasaude.com/beber-agua/";
        break;
      case "intestino":
        resposta = "Um intestino saudável começa com fibras, água e bons hábitos.\n" +
                   "Dicas aqui: https://www.tuasaude.com/como-regular-o-intestino/";
        break;
      default:
        resposta = "Aqui está uma dica útil pra sua saúde e bem-estar!";
    }
  } else if (contato === "personal") {
    switch (tema) {
      case "treino":
        resposta = "Ótimo! Alternar cardio com treino de força é uma excelente estratégia.\n" +
                   "Veja mais:\n https://www.tuasaude.com/exercicios-com-halteres/";
        break;
      case "musculação":
        resposta = "Musculação é ótimo para o corpo e mente! Vá no seu ritmo, respeitando seus limites.\n" +
                   "Veja aqui:\n https://blog.maxtitanium.com.br/treino-musculacao-tabela/";
        break;
      case "alongamento":
        resposta = "Alongar-se melhora sua postura e evita lesões.\n" +
                   "Confira algumas técnicas:\n https://www.bp.org.br/artigo/alongamentos-antes-do-treino-exercicios-pre-academia";
        break;
      case "descanso":
        resposta = "Seu corpo precisa descansar para crescer. Dormir bem também é parte do treino!\n" +
                   "Saiba mais:\n https://gauchazh.clicrbs.com.br/donna/fitness/noticia/2023/12/por-que-o-descanso-e-importante-para-o-ganho-de-massa-muscular-clq43zq2t002y016xd4opiro4.html";
        break;
      case "aquecimento":
        resposta = "Nunca pule o aquecimento! Ele prepara seu corpo e evita lesões.\n" +
                   "Dicas aqui:\n https://www.terra.com.br/vida-e-estilo/saude/exercicios-de-aquecimento-melhores-para-fazer-antes-da-musculacao,8c3becbdee835399d9282e776744df10u925wirq.html";
        break;
      default:
        resposta = "Aqui vai uma dica para turbinar seu desempenho!";
    }
  } else if (contato === "psicologa") {
    switch (tema) {
      case "ansiedade":
        resposta = "Respirar com calma, prestar atenção ao agora... essas práticas ajudam bastante.\n" +
                   "Dá uma olhada:\n https://vidasaudavel.einstein.br/ansiedade/";
        break;
      case "depressao":
        resposta = "A depressão precisa de cuidado e acolhimento. Não se isole. Conversar já é um grande passo.\n" +
                   "Mais informações:\n https://vidasaudavel.einstein.br/depressao-10-fatos-que-voce-precisa-conhecer-sobre-o-transtorno/";
        break;
      case "estresse":
        resposta = "O estresse é sinal de sobrecarga. Respire, se permita descansar.\n" +
                   "Veja mais:\n https://vidasaudavel.einstein.br/sintomas-de-estresse/";
        break;
      case "sono":
        resposta = "Dormir bem muda tudo! Uma rotina regular faz toda a diferença.\n" +
                   "Entenda melhor:\n https://institutodosono.com/artigos-noticias/o-papel-vital-do-sono-para-o-funcionamento-do-organismo/";
        break;
      case "triste":
      case "tristeza":
        resposta = "Sentir tristeza é humano. Permita-se sentir, mas não carregue isso sozinho.\n" +
                   "Sugestões aqui:\n https://www.einstein.br/n/glossario-de-saude/tristeza-profunda";
        break;
      case "autoestima":
        resposta = "Autoestima se constrói com carinho por você mesma, dia após dia.\n" +
                   "Leia mais:\n https://www.psicologossaopaulo.com.br/blog/autoestima-o-que-e-como-definir/";
        break;
      case "relacionamentos":
        resposta = "Relacionamentos saudáveis exigem empatia e comunicação. Não tenha medo de impor limites.\n" +
                   "Saiba mais:\n https://www.significados.com.br/relacionamento/";
        break;
      default:
        resposta = "Aqui está uma dica que pode te ajudar nesse momento.";
    }
  }

  return resposta + "\n\nPosso te ajudar com mais alguma coisa?";
}


function responderNutri(texto) {
  let resposta = "";
  if (texto.includes("emagrecer")) {
    resposta = "Entendi! Emagrecer com saúde é possível, sim. Quer uma dica que pode te ajudar a começar? (sim/não)";
    aguardandoConfirmacao = "emagrecer";
  } else if (texto.includes("dieta") || texto.includes("alimentação")) {
    resposta = "Uma alimentação equilibrada faz toda a diferença no bem-estar. Posso te sugerir um exemplo de como organizar isso? (sim/não)";
    aguardandoConfirmacao = "dieta";
  } else if (texto.includes("cardápio")) {
    resposta = "Legal! Um cardápio bem montado deixa a rotina mais prática e saudável. Quer uma sugestão? (sim/não)";
    aguardandoConfirmacao = "cardapio";
  } else if (texto.includes("receitas")) {
    resposta = "Que delícia! Tenho algumas receitas saudáveis e fáceis de fazer. Posso te enviar? (sim/não)";
    aguardandoConfirmacao = "receitas";
  } else if (texto.includes("exercícios") || texto.includes("exercicios")) {
    resposta = "Combinar exercício com boa alimentação é uma ótima estratégia! Quer saber como equilibrar os dois? (sim/não)";
    aguardandoConfirmacao = "exercicios";
  } else if (texto.includes("água") || texto.includes("hidratação")) {
    resposta = "Beber água é essencial! Quer entender melhor por que isso ajuda até no emagrecimento? (sim/não)";
    aguardandoConfirmacao = "hidratação";
  } else if (texto.includes("intestino") || texto.includes("prisão de ventre")) {
    resposta = "Seu intestino anda preguiçoso? Uma boa alimentação pode ajudar muito! Quer algumas dicas? (sim/não)";
    aguardandoConfirmacao = "intestino";
  } else if (texto.includes("obrigado") || texto.includes("valeu") || texto.includes("obrigada") || texto.includes("não")) {
    resposta = "Imagina! Estou sempre por aqui se precisar de mais alguma orientação. Cuide-se!";
  } else {
    resposta = "Oi! Sou a Dra. Mayara, nutricionista. Você quer ajuda com algo específico como alimentação, emagrecimento ou receitas?";
  }
  return resposta;
}


function responderPersonal(texto) {
  let resposta = "";
  if (texto.includes("treino") || texto.includes("exercício") || texto.includes("exercicio")) {
    resposta = "Treinar com constância é o segredo! Quer que eu te envie uma dica para variar seu treino? (sim/não)";
    aguardandoConfirmacao = "treino";
  } else if (texto.includes("musculação")) {
    resposta = "A musculação fortalece corpo e mente! Quer saber como começar ou progredir com segurança? (sim/não)";
    aguardandoConfirmacao = "musculação";
  } else if (texto.includes("alongamento")) {
    resposta = "Alongar antes e depois do treino evita lesões e melhora o rendimento. Posso te mostrar como? (sim/não)";
    aguardandoConfirmacao = "alongamento";
  } else if (texto.includes("descanso")) {
    resposta = "Descansar também faz parte do treino! Seu corpo precisa desse tempo pra evoluir. Quer entender melhor? (sim/não)";
    aguardandoConfirmacao = "descanso";
  } else if (texto.includes("aquecimento")) {
    resposta = "Aquecimento é essencial para preparar o corpo. Quer algumas ideias simples pra começar? (sim/não)";
    aguardandoConfirmacao = "aquecimento";
  } else if (texto.includes("cansaço") || texto.includes("motivar") || texto.includes("desanimado") || texto.includes("desmotivada")) {
    resposta = "Sei como é difícil manter a motivação às vezes. Quer algumas dicas pra retomar o foco com leveza? (sim/não)";
    aguardandoConfirmacao = "motivacao";
  } else if (texto.includes("obrigado") || texto.includes("valeu") || texto.includes("obrigada") || texto.includes("não")) {
    resposta = "Disponha! Continue firme, um passo de cada vez já é progresso.";
  } else {
    resposta = "Oi! Sou seu Personal Trainer. Me conta: quer ajuda com treinos, alongamentos ou como manter a motivação?";
  }
  return resposta;
}


function responderPsicologa(texto) {
  let resposta = "";
  if (texto.includes("ansiedade")) {
    resposta = "A ansiedade pode ser difícil de lidar, mas você não está sozinha. Quer conhecer algumas técnicas que podem ajudar? (sim/não)";
    aguardandoConfirmacao = "ansiedade";
  } else if (texto.includes("depressão") || texto.includes("depressao")) {
    resposta = "É importante falar sobre isso. Posso compartilhar algumas formas de buscar apoio e cuidar da saúde emocional? (sim/não)";
    aguardandoConfirmacao = "depressao";
  } else if (texto.includes("estresse")) {
    resposta = "O estresse pode se acumular silenciosamente. Posso te dar dicas de como aliviar um pouco essa carga? (sim/não)";
    aguardandoConfirmacao = "estresse";
  } else if (texto.includes("sono")) {
    resposta = "Dormir bem é essencial para o equilíbrio emocional. Quer que eu te envie sugestões para melhorar a qualidade do sono? (sim/não)";
    aguardandoConfirmacao = "sono";
  } else if (texto.includes("triste") || texto.includes("tristeza")) {
    resposta = "É natural se sentir triste às vezes. Posso te sugerir formas de cuidar de você nesse momento? (sim/não)";
    aguardandoConfirmacao = "triste";
  } else if (texto.includes("autoestima")) {
    resposta = "A autoestima se constrói com gentileza e paciência. Quer algumas dicas pra se cuidar com mais carinho? (sim/não)";
    aguardandoConfirmacao = "autoestima";
  } else if (texto.includes("relacionamento") || texto.includes("relacionamentos")) {
    resposta = "Relacionamentos podem ser desafiadores. Quer conversar sobre como manter relações mais saudáveis? (sim/não)";
    aguardandoConfirmacao = "relacionamentos";
  } else if (texto.includes("obrigado") || texto.includes("valeu") || texto.includes("obrigada") || texto.includes("não")) {
    resposta = "Fico feliz em ajudar. Se precisar conversar novamente, estou aqui.";
  } else {
    resposta = "Oi! Sou a psicóloga aqui do time. Você quer conversar sobre algo específico como ansiedade, autoestima ou relações?";
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
