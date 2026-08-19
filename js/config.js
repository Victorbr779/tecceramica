/**
 * config.js — TECCERAMICA
 * -----------------------------------------------------------------------
 * TODOS os dados que costumam mudar (WhatsApp, telefone, e-mail, endereço,
 * horários e a mensagem padrão do WhatsApp) ficam centralizados aqui.
 * Edite só este arquivo para atualizar essas informações em TODO o site —
 * elas são aplicadas automaticamente pelo script.js em todos os pontos
 * onde aparecem (header, hero, CTA final, rodapé, seção de localização
 * e botão flutuante).
 *
 * Campos marcados com "PREENCHER" ainda não foram fornecidos pela
 * Tecceramica. Enquanto não forem preenchidos, o site mostra um texto
 * de aviso no lugar (ver script.js) em vez de inventar uma informação.
 *
 * Veja o README.md para instruções passo a passo de como editar cada campo.
 * -----------------------------------------------------------------------
 */

const siteConfig = {
  // Identidade
  brandName: "Tecceramica",
  brandTagline: "Prótese Dentária",
  brandSlogan: "Tecnologia · Precisão · Confiança",

  // WhatsApp: número completo no formato internacional, só dígitos
  // (código do país + DDD + número). Ex.: "5547999999999".
  // Enquanto não for preenchido, os botões de WhatsApp ficam desativados
  // e mostram um aviso, em vez de apontar para um número inventado.
  whatsappNumber: "5522997754919",

  // Mensagem inicial que abre pré-preenchida no WhatsApp.
  whatsappMessage:
    "Olá! Conheci a Tecceramica pelo site e gostaria de saber mais sobre os serviços do laboratório.",

  // Telefone fixo (opcional). Formato de exibição livre.
  phoneDisplay: "(22) 99775-4919",
  phoneDial: "+5522997754919", // usado no href="tel:"

  // E-mail de contato.
  email: "labrabello@gmail.com",

  // Redes sociais (deixe em branco "" para ocultar o ícone correspondente).
  social: {
    instagram: "", // PREENCHER — ex.: "https://instagram.com/seu_usuario"
    facebook: "",
    linkedin: "",
  },

  // Endereço completo. Enquanto "street" estiver vazio, a seção de
  // localização exibe apenas cidade/estado e um aviso de "endereço em breve".
  address: {
    street: "R. Maj. Felix Moreira, 297 - Centro",
    city: "Araruama",
    state: "RJ",
    zip: "28979-102",
  },

  // Usado apenas para montar o mapa incorporado enquanto o endereço
  // completo não é definido (com "address.street" preenchido, o mapa já
  // usa o endereço completo automaticamente — ver script.js).
  mapQuery: "Araruama, RJ, Brasil",

  // Horário de funcionamento (texto livre, uma linha por período).
  businessHours: ["Segunda a sexta: 08h às 17h"],

  // CNPJ (opcional, exibido no rodapé se preenchido).
  cnpj: "", // PREENCHER

  // Endpoint de backend/API para receber os envios do formulário de
  // contato (ex.: "https://api.seuservico.com/leads" ou um endpoint de
  // um serviço de formulários). Enquanto estiver vazio, o formulário,
  // após validar os campos, encaminha os dados para o WhatsApp
  // configurado acima (fallback honesto: não existe backend ainda,
  // então não fingimos um envio por e-mail que não vai acontecer).
  formEndpoint: "", // PREENCHER quando houver backend/serviço de formulários
};
