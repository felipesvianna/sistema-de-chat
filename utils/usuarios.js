/**
 * Arquivo que contem as funcoes que sao responsaveis pelo controle de usuários
 *
 */

const listaDeUsuarios = [];

function inserirUsuarioNaSala(id, nomeDeUsuario, nomeDaSala) {
  const usuario = { id, nomeDeUsuario, nomeDaSala };

  listaDeUsuarios.push(usuario);

  return usuario;
}

function removerUsuarioDaSala(id) {
  const index = listaDeUsuarios.findIndex((usuario) => usuario.id === id);

  if (index !== -1) {
    return listaDeUsuarios.splice(index, 1)[0];
  }

  return false;
}

function getListaDeUsuariosDaSala(nomeDaSala) {
  return listaDeUsuarios.filter((usuario) => usuario.nomeDaSala === nomeDaSala);
}

function getUsuario(id) {
  return listaDeUsuarios.find((usuario) => usuario.id === id);
}

module.exports = {
  inserirUsuarioNaSala,
  removerUsuarioDaSala,
  getListaDeUsuariosDaSala,
  getUsuario,
};
