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
function registerRevealFinished(
  io,
  socket
) {

  socket.on(
    SOCKET_EVENTS.REVEAL_FINISHED,

    code => {

      const room =
        rooms.get(code)

      if (!room?.game) {
        return
      }

      if (

        room.game.phase !==
        GAME_PHASES.REVEAL

      ) {

        return
      }

      room.players.forEach(
        player => {

          player.ready = false
        }
      )

      room.game.phase =
        GAME_PHASES.VOTING

      emitGame(io, room)

      console.log(
        "Reveal finished → Voting started"
      )
    }
  )
}