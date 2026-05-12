const rooms =
  require("../../state/rooms")

const {
  SOCKET_EVENTS
} = require("../../../shared/constants/socketEvents")

const {
  emitLobby,
  emitGame
} = require("../../emitters/gameEmitter")

const {
  cancelPendingRemoval
} = require("../../services/lobby/reconnectService")

const {
  ensureActiveHost
} = require("../../services/lobby/playerLifecycleService")

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
}

function findReconnectPlayer(
  room,
  username,
  sessionId
) {
  return room.players.find(player =>
    sessionId &&
    player.sessionId === sessionId
  ) || room.players.find(player =>
    !player.connected &&
    normalize(player.username) ===
    normalize(username)
  )
}

module.exports =
function registerReconnectLobby(
  io,
  socket
) {

  socket.on(
    SOCKET_EVENTS.RECONNECT_LOBBY,

    ({
      code,
      username,
      sessionId
    }) => {

      const room =
        rooms.get(code)

      if (!room) {
        return socket.emit(
          SOCKET_EVENTS.LOBBY_ERROR,
          "Lobby not found"
        )
      }

      const player =
        findReconnectPlayer(
          room,
          username,
          sessionId
        )

      if (!player) {
        return socket.emit(
          SOCKET_EVENTS.LOBBY_ERROR,
          "Reconnect failed"
        )
      }

      const previousId =
        player.id

      cancelPendingRemoval(
        room,
        player
      )

      player.id =
        socket.id

      player.sessionId =
        sessionId || player.sessionId

      player.connected =
        true

      if (
        room.hostId === previousId ||
        player.isHost
      ) {
        room.hostId =
          socket.id

        player.isHost =
          true
      }

      ensureActiveHost(room)

      if (room.game) {
        room.game.submissions.forEach(submission => {
          if (
            submission.player.id ===
            previousId
          ) {
            submission.player.id =
              socket.id
          }
        })
      }

      socket.join(code)

      socket.emit(
        SOCKET_EVENTS.RECONNECT_LOBBY_SUCCESS,
        room
      )

      emitLobby(io, room)

      if (room.game) {
        emitGame(io, room)
      }
    }
  )
}
