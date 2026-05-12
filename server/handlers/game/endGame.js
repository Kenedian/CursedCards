const rooms =
  require("../../state/rooms")

const {
  SOCKET_EVENTS
} = require("../../../shared/constants/socketEvents")

const {
  GAME_PHASES
} = require("../../../shared/constants/gamePhases")

const {
  emitGame
} = require("../../emitters/gameEmitter")

module.exports =
function registerEndGame(
  io,
  socket
) {

  socket.on(
    SOCKET_EVENTS.END_GAME,

    code => {

      const room =
        rooms.get(code)

      if (!room?.game) {
        return
      }

      if (
        room.hostId !==
        socket.id
      ) {

        return
      }

      room.game.phase =
        GAME_PHASES.GAME_OVER

      emitGame(io, room)

      console.log(
        "game ended early"
      )
    }
  )
}
