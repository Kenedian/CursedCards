const rooms =
  require("../../state/rooms")

const {
  SOCKET_EVENTS
} = require("../../../shared/constants/socketEvents")

const {
  MAX_PLAYERS
} = require("../../services/gameService")

const {
  emitLobby
} = require("../../emitters/gameEmitter")

const {
  normalizeUsername,
  getUsernameError
} = require("../../utils/lobby/username")

module.exports =
function registerJoinLobby(
  io,
  socket
) {

  socket.on(
    SOCKET_EVENTS.JOIN_LOBBY,

    ({
      username,
      code,
      sessionId
    }) => {

      const normalizedUsername =
        normalizeUsername(username)

      const usernameError =
        getUsernameError(
          normalizedUsername
        )

      if (usernameError) {
        return socket.emit(
          SOCKET_EVENTS.LOBBY_ERROR,
          usernameError
        )
      }

      const room =
        rooms.get(code)

      if (!room) {

        return socket.emit(
          SOCKET_EVENTS.LOBBY_ERROR,
          "Lobby not found"
        )
      }

      if (room.game) {

        return socket.emit(
          SOCKET_EVENTS.LOBBY_ERROR,
          "Game already in progress"
        )
      }

      if (
        room.players.length >=
        MAX_PLAYERS
      ) {

        return socket.emit(
          SOCKET_EVENTS.LOBBY_ERROR,
          "Lobby is full"
        )
      }

      const duplicateUsername =

        room.players.some(

          player =>

            player.username
              .toLowerCase()
              .trim()

            ===

            normalizedUsername
              .toLowerCase()
              .trim()
        )

      if (duplicateUsername) {

        return socket.emit(
          SOCKET_EVENTS.LOBBY_ERROR,
          "Username already taken"
        )
      }

      room.players.push({

        id: socket.id,

        sessionId,

        connected: true,

        username:
          normalizedUsername,

        isHost: false,

        ready: false,

        score: 0,

        hand: [],

        selectedCards: [],

        selectedVoteId: null
      })

      socket.join(code)

      socket.emit(
        SOCKET_EVENTS.JOIN_LOBBY_SUCCESS,
        room
      )

      emitLobby(io, room)

      console.log(
        "player joined:",
        code
      )
    }
  )
}
