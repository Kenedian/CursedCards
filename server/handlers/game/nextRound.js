const rooms =
  require("../../state/rooms")

const {
  SOCKET_EVENTS
} = require("../../../shared/constants/socketEvents")

const {
  GAME_PHASES
} = require("../../../shared/constants/gamePhases")

const {
  nextRound
} = require("../../services/gameService")

const {
  emitGame
} = require("../../emitters/gameEmitter")

module.exports =
function registerNextRound(
  io,
  socket
) {

  socket.on(
    SOCKET_EVENTS.NEXT_ROUND,

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

      if (
        room.game.maxRounds > 0 &&

        room.game.round >=
        room.game.maxRounds

      ) {

        room.game.phase =
          GAME_PHASES.GAME_OVER

        emitGame(io, room)

        console.log(
          "game over"
        )

        return
      }

      nextRound(room)

      emitGame(io, room)

      console.log(
        "next round started"
      )
    }
  )
}
