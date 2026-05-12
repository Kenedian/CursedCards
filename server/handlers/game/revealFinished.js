const rooms =
  require("../../state/rooms")

const {
  SOCKET_EVENTS
} = require("../../../shared/constants/socketEvents")

const {
  GAME_PHASES
} = require("../../../shared/constants/gamePhases")

const {
  handleRevealFinished
} = require("../../services/game/revealPhaseService")

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

      handleRevealFinished(
        io,
        room,
        socket.id
      )
    }
  )
}
