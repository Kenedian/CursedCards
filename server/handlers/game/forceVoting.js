const rooms =
  require("../../state/rooms")

const {
  SOCKET_EVENTS
} = require("../../../shared/constants/socketEvents")

const {
  GAME_PHASES
} = require("../../../shared/constants/gamePhases")

const {
  completeReveal
} = require("../../services/game/revealPhaseService")

module.exports =
function registerForceVoting(
  io,
  socket
) {

  socket.on(
    SOCKET_EVENTS.FORCE_VOTING,

    code => {

      const room =
        rooms.get(code)

      if (
        !room?.game ||
        room.game.phase !==
        GAME_PHASES.REVEAL
      ) {
        return
      }

      if (
        room.hostId !==
        socket.id
      ) {

        return
      }

      completeReveal(
        io,
        room,
        "forced by host"
      )
    }
  )
}
