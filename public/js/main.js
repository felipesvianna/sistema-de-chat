/* eslint-disable no-restricted-globals */
const chatFormDom = document.getElementById('chat-form');
const chatMessagesDom = document.querySelector('.chat-mensagens');
const nomeDaSalaDom = document.getElementById('nome-da-sala');
const listaDeUsuariosDom = document.getElementById('usuarios');

/** Funcoes para exibir os dados no DOM */

function exibirNomeDaSala(nome) {
  nomeDaSalaDom.innerText = `Sala ${nome}`;
}

function exibirNomesUsuarios(listaDeUsuarios) {
  listaDeUsuariosDom.innerHTML = `
    ${listaDeUsuarios
      .map((usuario) => `<li>${usuario.nomeDeUsuario}</li>`)
      .join('')}
  `;
}

function exibirMensagem(mensagem) {
  const div = document.createElement('div');
  div.classList.add('mensagem');
  div.innerHTML = `<p class="meta">${mensagem.nomeDeUsuario} <span>${mensagem.horarioDaMensagem}</span></p>
  <p class="texto">
    ${mensagem.texto}
  </p>`;
  document.querySelector('.chat-mensagens').appendChild(div);
}

function exibirMensagemSistema(mensagem) {
  const div = document.createElement('div');
  div.classList.add('mensagem-sistema');
  div.innerHTML = `<p>${mensagem}</p>`;
  document.querySelector('.chat-mensagens').appendChild(div);
}

// Pegar valores das variaveis usuario e sala da URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const usuario = urlParams.get('usuario');
const sala = urlParams.get('sala');

/** Event Listeners */

// eslint-disable-next-line no-undef
const socket = io();

socket.emit('entrarNaSala', { nomeDeUsuario: usuario, nomeDaSala: sala });

socket.on('atualizarUsuariosDasSalas', ({ nomeDaSala, listaDeUsuarios }) => {
  exibirNomeDaSala(nomeDaSala);
  exibirNomesUsuarios(listaDeUsuarios);
});

socket.on('mensagem', (mensagem) => {
  exibirMensagem(mensagem);

  // Rolagem automatica
  chatMessagesDom.scrollTop = chatMessagesDom.scrollHeight;
});

socket.on('mensagem-sistema', (mensagem) => {
  exibirMensagemSistema(mensagem);

  // Rolagem automatica
  chatMessagesDom.scrollTop = chatMessagesDom.scrollHeight;
});

chatFormDom.addEventListener('submit', (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;
  socket.emit('mensagemDeChat', msg);

  // Limpar input da mensagem
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});
