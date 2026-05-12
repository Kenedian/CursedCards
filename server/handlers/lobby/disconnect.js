const rooms =
  require("../../state/rooms")

const {
  emitLobby,
  emitGame
} = require("../../emitters/gameEmitter")

const {
  schedulePlayerRemoval
} = require("../../services/lobby/reconnectService")

const {
  handleRevealPlayerUnavailable
} = require("../../services/game/revealPhaseService")

module.exports =
function registerDisconnect(
  io,
  socket
) {

  socket.on(
    "disconnect",

    () => {

      for (
        const [code, room]
        of rooms
      ) {

        const exists =

          room.players.find(

            player =>

              player.id ===
              socket.id
          )

        if (!exists) {
          continue
        }

        exists.connected =
          false

        schedulePlayerRemoval(
          io,
          room,
          exists
        )

        emitLobby(io, room)

        if (room.game) {
          handleRevealPlayerUnavailable(
            io,
            room
          )

          emitGame(io, room)
        }
      }
    }
  )
}
