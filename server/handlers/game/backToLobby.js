const rooms =
  require("../../state/rooms")

const {
  SOCKET_EVENTS
} = require("../../../shared/constants/socketEvents")

const {
  emitLobby
} = require("../../emitters/gameEmitter")

module.exports =
function registerBackToLobby(
  io,
  socket
) {

  socket.on(
    SOCKET_EVENTS.BACK_TO_LOBBY,

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

      room.players.forEach(
        player => {

          player.ready = false

          player.score = 0

          player.hand = []

          player.selectedCards = []

          player.selectedVoteId = null
        }
      )

      room.game = null

      emitLobby(io, room)

      console.log(
        "returned to lobby"
      )
    }
  )
}