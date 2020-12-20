const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const {
  inserirUsuarioNaSala,
  getUsuario,
  removerUsuarioDaSala,
  getListaDeUsuariosDaSala,
} = require('./utils/usuarios');

const formatarMensagem = require('./utils/mensagens');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Define diretorio estatico da aplicacao
app.use(express.static(path.join(__dirname, 'public')));

const nomeDoBot = 'ChatBot';

// // Event Listener para conexao de usuarios
io.on('connection', (socket) => {
  socket.on('entrarNaSala', ({ nomeDeUsuario, nomeDaSala }) => {
    const usuario = inserirUsuarioNaSala(socket.id, nomeDeUsuario, nomeDaSala);

    socket.join(usuario.nomeDaSala);

    socket.emit(
      'mensagem',
      formatarMensagem(nomeDoBot, `Seja bem-vindo(a) ${usuario.nomeDeUsuario}!`)
    );

    socket.broadcast
      .to(usuario.nomeDaSala)
      .emit(
        'mensagem',
        formatarMensagem(nomeDoBot, `${usuario.nomeDeUsuario} entrou no chat`)
      );

    // Envia informacoes atualizadas dos usuarios e da sala
    io.to(usuario.nomeDaSala).emit('atualizarUsuariosDasSalas', {
      nomeDaSala: usuario.nomeDaSala,
      listaDeUsuarios: getListaDeUsuariosDaSala(usuario.nomeDaSala),
    });
  });

  // Event Listener para mensagens
  socket.on('mensagemDeChat', (msg) => {
    const usuario = getUsuario(socket.id);

    io.to(usuario.nomeDaSala).emit(
      'mensagem',
      formatarMensagem(usuario.nomeDeUsuario, msg)
    );
  });

  // Event Listener para desconexao
  socket.on('disconnect', () => {
    const usuario = removerUsuarioDaSala(socket.id);

    if (usuario) {
      io.to(usuario.nomeDaSala).emit(
        'mensagem',
        formatarMensagem(nomeDoBot, `${usuario.nomeDeUsuario} saiu do chat`)
      );

      // Envia informacoes atualizadas dos usuarios e da sala
      io.to(usuario.nomeDaSala).emit('atualizarUsuariosDasSalas', {
        nomeDaSala: usuario.nomeDaSala,
        listaDeUsuarios: getListaDeUsuariosDaSala(usuario.nomeDaSala),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
