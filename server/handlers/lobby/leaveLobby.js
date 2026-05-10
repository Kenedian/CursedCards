const rooms =
  require("../../state/rooms")

const {
  SOCKET_EVENTS
} = require("../../../shared/constants/socketEvents")

const {
  emitLobby,
  emitGame
} = require("../../emitters/gameEmitter")

const {
  removePlayerFromRoom
} = require("../../services/lobby/playerLifecycleService")

module.exports =
function registerLeaveLobby(
  io,
  socket
) {

  socket.on(
    SOCKET_EVENTS.LEAVE_LOBBY,

    code => {

      const room =
        rooms.get(code)

      if (!room) {
        return
      }

      removePlayerFromRoom(
        room,
        socket.id
      )

      socket.leave(code)

      if (
        room.players.length === 0
      ) {

        rooms.delete(code)

        return
      }

      emitLobby(io, room)

      if (room.game) {
        emitGame(io, room)
      }

      console.log(
        "player left:",
        socket.id
      )
    }
  )
}