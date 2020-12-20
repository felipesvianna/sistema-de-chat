/**
 * Arquivo que contem as funcoes que sao responsaveis pelo controle de mensagens
 *
 */

const moment = require('moment');

function formatarMensagem(nomeDeUsuario, texto) {
  return {
    nomeDeUsuario,
    texto,
    horarioDaMensagem: moment().format('h:mm a'),
  };
}

module.exports = formatarMensagem;
