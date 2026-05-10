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
function registerKickPlayer(
  io,
  socket
) {

  socket.on(
    SOCKET_EVENTS.KICK_PLAYER,

    ({
      code,
      playerId
    }) => {

      const room =
        rooms.get(code)

      if (
        !room ||

        room.hostId !==
        socket.id
      ) {

        return
      }

      removePlayerFromRoom(
        room,
        playerId
      )

      const targetSocket =

        io.sockets.sockets.get(
          playerId
        )

      if (targetSocket) {

        targetSocket.leave(
          room.code
        )

        targetSocket.emit(
          SOCKET_EVENTS.PLAYER_KICKED
        )
      }

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
        "player kicked:",
        playerId
      )
    }
  )
}