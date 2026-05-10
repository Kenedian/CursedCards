const rooms =
  require("../../state/rooms")

const {
  emitLobby,
  emitGame
} = require("../../emitters/gameEmitter")

const {
  removePlayerFromRoom
} = require("../../services/lobby/playerLifecycleService")

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

        removePlayerFromRoom(
          room,
          socket.id
        )

        if (
          room.players.length === 0
        ) {

          rooms.delete(code)

          continue
        }

        emitLobby(io, room)

        if (room.game) {
          emitGame(io, room)
        }
      }
    }
  )
}