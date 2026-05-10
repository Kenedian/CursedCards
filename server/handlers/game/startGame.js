const rooms =
  require("../../state/rooms")

const {
  SOCKET_EVENTS
} = require("../../../shared/constants/socketEvents")

const {
  startGame
} = require("../../services/gameService")

const {
  emitGame
} = require("../../emitters/gameEmitter")

module.exports =
function registerStartGame(
  io,
  socket
) {

  socket.on(
    SOCKET_EVENTS.START_GAME,

    code => {

      const room =
        rooms.get(code)

      if (!room) {
        return
      }

      if (
        room.hostId !==
        socket.id
      ) {

        return
      }

      if (
        room.players.length < 3
      ) {

        return
      }

      startGame(room)

      emitGame(io, room)

      console.log(
        "game started:",
        code
      )
    }
  )
}