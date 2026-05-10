const {
  SOCKET_EVENTS
} = require("../../shared/constants/socketEvents")

function emitLobby(io, room) {

  io.to(room.code).emit(
    SOCKET_EVENTS.LOBBY_UPDATED,
    room
  )
}

function emitGame(io, room) {

  io.to(room.code).emit(
    SOCKET_EVENTS.GAME_UPDATED,
    room
  )
}

module.exports = {

  emitLobby,
  emitGame
}