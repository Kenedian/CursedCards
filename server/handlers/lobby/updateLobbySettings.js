const rooms =
  require("../../state/rooms")

const {
  SOCKET_EVENTS
} = require("../../../shared/constants/socketEvents")

const {
  emitLobby
} = require("../../emitters/gameEmitter")

function normalizeMaxRounds(value) {
  const number =
    Number(value)

  if (
    Number.isNaN(number) ||
    number < 0
  ) {
    return 10
  }

  return Math.floor(number)
}

module.exports =
function registerUpdateLobbySettings(
  io,
  socket
) {

  socket.on(
    SOCKET_EVENTS.UPDATE_LOBBY_SETTINGS,

    ({
      code,
      maxRounds
    }) => {

      const room =
        rooms.get(code)

      if (
        !room ||
        room.hostId !== socket.id ||
        room.game
      ) {
        return
      }

      room.maxRounds =
        normalizeMaxRounds(maxRounds)

      emitLobby(
        io,
        room
      )
    }
  )
}

